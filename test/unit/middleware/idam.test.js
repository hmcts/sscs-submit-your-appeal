const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');
const { expect, sinon } = require('test/util/chai');
const idam = require('middleware/idam');
const { URL } = require('url');

describe('middleware/idam', () => {
  const req = {
    host: 'host',
    cookies: {},
    get: null,
    session: {}
  };
  const res = {};
  let next = null;
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    next = sandbox.stub();
    req.get = sandbox.stub().withArgs('host').returns('host');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should contain all keys', () => {
    expect(idam).to.have.all.keys(
      'getIdamArgs',
      'authenticate',
      'landingPage',
      'protect',
      'logout',
      'userDetails'
    );
  });

  it('logout should call logout middleware if there is a session', () => {
    req.cookies['__auth-token'] = 'aToken';
    const middleWareStub = sandbox.spy(idamExpressMiddleware, 'logout');
    idam.logout(req, res, next);
    expect(middleWareStub).to.have.been.called;
  });

  describe('authenticate', () => {
    it('should redirect to the idam login url with a scope param', () => {
      const redirect = sandbox.stub();
      idam.authenticate(req, { redirect }, next);

      expect(redirect).to.have.been.calledOnce;
      const redirectUrl = new URL(redirect.firstCall.args[0]);
      expect(redirectUrl.searchParams.get('scope')).to.equal('openid profile roles');
      expect(redirectUrl.searchParams.get('client_id')).to.equal(idam.getIdamArgs().idamClientID);
      expect(redirectUrl.searchParams.get('response_type')).to.equal('code');
      expect(redirectUrl.searchParams.has('state')).to.be.true;
      expect(next).to.not.have.been.called;
    });
  });

  describe('landingPage', () => {
    it('should redirect to the idam login url with a scope param when there is no code on the query string', () => {
      const redirect = sandbox.stub();
      const reqWithoutCode = Object.assign({}, req, { query: {} });
      idam.landingPage(reqWithoutCode, { redirect }, next);

      expect(redirect).to.have.been.calledOnce;
      const redirectUrl = new URL(redirect.firstCall.args[0]);
      expect(redirectUrl.searchParams.get('scope')).to.equal('openid profile roles');
    });

    it('should call the idam landingPage middleware when there is a code on the query string', () => {
      const reqWithCode = Object.assign({}, req, { query: { code: 'aCode' } });
      const redirect = sandbox.stub();
      const middleWareStub = sandbox.spy(idamExpressMiddleware, 'landingPage');
      idam.landingPage(reqWithCode, { redirect }, next);
      expect(middleWareStub).to.have.been.called;
    });
  });
});
