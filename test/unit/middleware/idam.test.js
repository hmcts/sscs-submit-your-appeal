const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');
const { tokenCookieName, stateCookieName } = require('@hmcts/div-idam-express-middleware/config');
const { expect, sinon } = require('test/util/chai');
const idam = require('middleware/idam');
const { URL } = require('url');
const got = require('got');

describe('middleware/idam', () => {
  const req = {
    host: 'host',
    cookies: {},
    get: null,
    session: {}
  };
  let next = null;
  let sandbox = null;
  const userInfo = {
    uid: 'user-1',
    sub: 'jane.doe@test.local',
    given_name: 'Jane',
    family_name: 'Doe',
    name: 'Jane Doe',
    roles: ['citizen']
  };
  const userDetails = {
    id: 'user-1',
    email: 'jane.doe@test.local',
    forename: 'Jane',
    surname: 'Doe',
    roles: ['citizen']
  };
  const stubUserInfo = () => sandbox.stub(got, 'get').returns({ json: sandbox.stub().resolves(userInfo) });
  const stubUserInfoFailure = () => sandbox.stub(got, 'get').returns({ json: sandbox.stub().rejects(new Error('invalid token')) });
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    next = sandbox.stub();
    req.get = sandbox.stub().withArgs('host').returns('host');
    req.cookies = {};
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should contain all keys', () => {
    expect(idam).to.have.all.keys(
      'getIdamArgs',
      'idTokenCookieName',
      'authenticate',
      'buildEndSessionUrl',
      'landingPage',
      'protect',
      'logout',
      'userDetails'
    );
  });

  describe('logout', () => {
    it('should call the logout middleware if there is a session', () => {
      const middleWareStub = sandbox.stub(idamExpressMiddleware, 'logout')
        .returns((logoutReq, logoutRes, done) => done());
      req.cookies['__auth-token'] = 'aToken';

      idam.logout(req, { clearCookie: sandbox.stub() }, next);

      expect(middleWareStub).to.have.been.called;
    });

    it('should clear the auth token cookie with the domain it was set on, regardless of the idam session delete outcome', () => {
      sandbox.stub(idamExpressMiddleware, 'logout').returns((logoutReq, logoutRes, done) => done());
      const clearCookie = sandbox.stub();
      const localNext = sandbox.stub();
      const reqWithToken = Object.assign({}, req, {
        cookies: { [tokenCookieName]: 'aToken' },
        hostname: 'host'
      });

      idam.logout(reqWithToken, { clearCookie }, localNext);

      expect(clearCookie).to.have.been.calledWith(tokenCookieName, { domain: 'host' });
      expect(localNext).to.have.been.calledOnce;
    });

    it('should call next without contacting idam when there is no auth token cookie', () => {
      const middleWareStub = sandbox.stub(idamExpressMiddleware, 'logout');

      idam.logout(req, { clearCookie: sandbox.stub() }, next);

      expect(middleWareStub).to.not.have.been.called;
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('authenticate', () => {
    it('should redirect to the idam login url with a scope param and set the state cookie', () => {
      const redirect = sandbox.stub();
      const cookie = sandbox.stub();
      idam.authenticate(req, { redirect, cookie }, next);

      expect(redirect).to.have.been.calledOnce;
      const redirectUrl = new URL(redirect.firstCall.args[0]);
      expect(redirectUrl.searchParams.get('scope')).to.equal('openid profile roles');
      expect(redirectUrl.searchParams.get('client_id')).to.equal(idam.getIdamArgs().idamClientID);
      expect(redirectUrl.searchParams.get('response_type')).to.equal('code');
      expect(redirectUrl.searchParams.has('state')).to.be.true;

      expect(cookie).to.have.been.calledOnce;
      const [cookieName, cookieValue] = cookie.firstCall.args;
      expect(cookieName).to.equal(stateCookieName);
      expect(cookieValue).to.equal(redirectUrl.searchParams.get('state'));
      expect(next).to.not.have.been.called;
    });

    it('should call next and set req.idam when a valid auth token cookie is present', async() => {
      const redirect = sandbox.stub();
      const cookie = sandbox.stub();
      const getStub = stubUserInfo();
      const reqWithToken = Object.assign({}, req, { cookies: { [tokenCookieName]: 'aToken' } });

      await idam.authenticate(reqWithToken, { redirect, cookie }, next);

      const [userInfoUrl, userInfoOptions] = getStub.firstCall.args;
      expect(userInfoUrl).to.equal(`${idam.getIdamArgs().idamApiUrl}/o/userinfo`);
      expect(userInfoOptions.headers.Authorization).to.equal('Bearer aToken');
      expect(next).to.have.been.calledOnce;
      expect(reqWithToken.idam).to.deep.equal({ userDetails });
      expect(redirect).to.not.have.been.called;
      expect(cookie).to.not.have.been.called;
    });

    it('should redirect to the idam login url when the auth token cookie is invalid', async() => {
      const redirect = sandbox.stub();
      const cookie = sandbox.stub();
      stubUserInfoFailure();
      const reqWithToken = Object.assign({}, req, { cookies: { [tokenCookieName]: 'aToken' } });

      await idam.authenticate(reqWithToken, { redirect, cookie }, next);

      expect(redirect).to.have.been.calledOnce;
      expect(cookie).to.have.been.calledOnce;
      expect(next).to.not.have.been.called;
    });

    it('should clear a stale state cookie before redirecting', () => {
      const redirect = sandbox.stub();
      const cookie = sandbox.stub();
      const clearCookie = sandbox.stub();
      const reqWithStateCookie = Object.assign({}, req, { cookies: { [stateCookieName]: 'stale-state' } });

      idam.authenticate(reqWithStateCookie, { redirect, cookie, clearCookie }, next);

      expect(clearCookie).to.have.been.calledOnceWith(stateCookieName);
    });
  });

  describe('landingPage', () => {
    it('should redirect to the idam login url with a scope param when there is no code on the query string', () => {
      const redirect = sandbox.stub();
      const cookie = sandbox.stub();
      const reqWithoutCode = Object.assign({}, req, { query: {} });
      idam.landingPage(reqWithoutCode, { redirect, cookie }, next);

      expect(redirect).to.have.been.calledOnce;
      const redirectUrl = new URL(redirect.firstCall.args[0]);
      expect(redirectUrl.searchParams.get('scope')).to.equal('openid profile roles');
    });

    it('should exchange the code for a session and store the auth token and id token cookies', async() => {
      const redirect = sandbox.stub();
      const cookie = sandbox.stub();
      const clearCookie = sandbox.stub();
      const postStub = sandbox.stub(got, 'post').returns({
        json: sandbox.stub().resolves({ access_token: 'anAccessToken', id_token: 'anIdToken' })
      });
      const getStub = stubUserInfo();
      const reqWithCode = Object.assign({}, req, { query: { code: 'aCode', state: 'aState' } });

      await idam.landingPage(reqWithCode, { redirect, cookie, clearCookie }, next);

      const [tokenUrl, tokenOptions] = postStub.firstCall.args;
      expect(tokenUrl).to.equal(`${idam.getIdamArgs().idamApiUrl}/o/token`);
      expect(tokenOptions.form).to.deep.equal({
        grant_type: 'authorization_code',
        code: 'aCode',
        redirect_uri: 'https://host/authenticated'
      });
      expect(tokenOptions.username).to.equal(idam.getIdamArgs().idamClientID);
      expect(tokenOptions.password).to.equal(idam.getIdamArgs().idamSecret);
      expect(cookie).to.have.been.calledWith(tokenCookieName, 'anAccessToken');
      expect(cookie).to.have.been.calledWith(idam.idTokenCookieName, 'anIdToken');
      expect(clearCookie).to.have.been.calledWith(stateCookieName);
      expect(getStub.firstCall.args[1].headers.Authorization).to.equal('Bearer anAccessToken');
      expect(reqWithCode.idam).to.deep.equal({ userDetails });
      expect(next).to.have.been.calledOnce;
      expect(redirect).to.not.have.been.called;
    });

    it('should redirect to the index page when there is no state to verify the callback against', async() => {
      const redirect = sandbox.stub();
      const reqWithCode = Object.assign({}, req, { query: { code: 'aCode' } });

      await idam.landingPage(reqWithCode, { redirect }, next);

      expect(redirect).to.have.been.calledOnceWith(idam.getIdamArgs().indexUrl);
      expect(next).to.not.have.been.called;
    });

    it('should redirect to the index page when the code exchange fails', async() => {
      const redirect = sandbox.stub();
      const clearCookie = sandbox.stub();
      sandbox.stub(got, 'post').returns({
        json: sandbox.stub().rejects(new Error('exchange failed'))
      });
      const reqWithCode = Object.assign({}, req, { query: { code: 'aCode', state: 'aState' } });

      await idam.landingPage(reqWithCode, { redirect, clearCookie }, next);

      expect(redirect).to.have.been.calledOnceWith(idam.getIdamArgs().indexUrl);
      expect(next).to.not.have.been.called;
    });
  });

  describe('userDetails', () => {
    it('should map the /o/userinfo response onto req.idam.userDetails', async() => {
      stubUserInfo();
      const reqWithToken = Object.assign({}, req, { cookies: { [tokenCookieName]: 'aToken' } });

      await idam.userDetails()(reqWithToken, {}, next);

      expect(reqWithToken.idam).to.deep.equal({ userDetails });
      expect(next).to.have.been.calledOnce;
    });

    it('should prefer the email claim over sub when present', async() => {
      sandbox.stub(got, 'get').returns({
        json: sandbox.stub().resolves(Object.assign({}, userInfo, { sub: 'subject', email: 'jane@test.local' }))
      });
      const reqWithToken = Object.assign({}, req, { cookies: { [tokenCookieName]: 'aToken' } });

      await idam.userDetails()(reqWithToken, {}, next);

      expect(reqWithToken.idam.userDetails.email).to.equal('jane@test.local');
    });

    it('should call next without contacting idam when there is no auth token cookie', async() => {
      const getStub = sandbox.stub(got, 'get');

      await idam.userDetails()(req, {}, next);

      expect(getStub).to.not.have.been.called;
      expect(next).to.have.been.calledOnce;
    });

    it('should clear the auth token cookie and call next when the token is invalid', async() => {
      stubUserInfoFailure();
      const clearCookie = sandbox.stub();
      const reqWithToken = Object.assign({}, req, { cookies: { [tokenCookieName]: 'aToken' } });

      await idam.userDetails()(reqWithToken, { clearCookie }, next);

      expect(clearCookie).to.have.been.calledOnceWith(tokenCookieName);
      expect(reqWithToken.idam).to.be.undefined;
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('protect', () => {
    it('should set req.idam and call next when the auth token is valid', async() => {
      stubUserInfo();
      const reqWithToken = Object.assign({}, req, { cookies: { [tokenCookieName]: 'aToken' } });

      await idam.protect()(reqWithToken, {}, next);

      expect(reqWithToken.idam).to.deep.equal({ userDetails });
      expect(next).to.have.been.calledOnce;
    });

    it('should redirect to the index page when there is no auth token cookie', async() => {
      const redirect = sandbox.stub();

      await idam.protect()(req, { redirect }, next);

      expect(redirect).to.have.been.calledOnceWith(idam.getIdamArgs().indexUrl);
      expect(next).to.not.have.been.called;
    });

    it('should clear the auth token cookie and redirect to the index page when the token is invalid', async() => {
      stubUserInfoFailure();
      const redirect = sandbox.stub();
      const clearCookie = sandbox.stub();
      const reqWithToken = Object.assign({}, req, { cookies: { [tokenCookieName]: 'aToken' } });

      await idam.protect()(reqWithToken, { redirect, clearCookie }, next);

      expect(clearCookie).to.have.been.calledOnceWith(tokenCookieName);
      expect(redirect).to.have.been.calledOnceWith(idam.getIdamArgs().indexUrl);
      expect(next).to.not.have.been.called;
    });
  });

  describe('buildEndSessionUrl', () => {
    it('builds the idam end-session url with the post_logout_redirect_uri and id_token_hint', () => {
      const reqWithIdToken = Object.assign({}, req, { cookies: { [idam.idTokenCookieName]: 'anIdToken' } });

      const endSessionUrl = new URL(idam.buildEndSessionUrl(reqWithIdToken, '/sign-out'));

      expect(endSessionUrl.origin).to.equal(new URL(idam.getIdamArgs().idamLoginUrl).origin);
      expect(endSessionUrl.pathname).to.equal('/o/endSession');
      expect(endSessionUrl.searchParams.get('id_token_hint')).to.equal('anIdToken');
      expect(endSessionUrl.searchParams.get('post_logout_redirect_uri')).to.equal('https://host/sign-out');
    });

    it('omits id_token_hint when there is no id token cookie', () => {
      const endSessionUrl = new URL(idam.buildEndSessionUrl(req, '/sign-out'));

      expect(endSessionUrl.searchParams.has('id_token_hint')).to.be.false;
    });
  });
});
