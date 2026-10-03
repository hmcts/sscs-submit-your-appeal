const { expect, sinon } = require('test/util/chai');
const SignOut = require('steps/idam/sign-out/SignOut');
const idam = require('middleware/idam');

const paths = require('paths');

describe('SignOut.js', () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('get path()', () => {
    it('returns path /exit', () => {
      expect(SignOut.path).to.equal(paths.idam.signOut);
    });

    it('clears cookies', () => {
      // mocks and spies
      const res = {
        clearCookie: (cookieName, options) => {
          return {
            name: cookieName,
            ops: options
          };
        }
      };

      const req = {
        hostname: 'hmcts.net'
      };

      const resMock = sinon.mock(res);
      resMock.expects('clearCookie').once().withArgs('__auth-token', {
        path: '/',
        domain: 'hmcts.net',
        httpOnly: true,
        secure: true
      });
      resMock.expects('clearCookie').once().withArgs('__state', {
        path: '/',
        domain: 'hmcts.net',
        httpOnly: true,
        secure: true
      });
      resMock.expects('clearCookie').once().withArgs(idam.idTokenCookieName, {
        path: '/',
        domain: 'hmcts.net',
        httpOnly: true,
        secure: true
      });

      const next = sinon.spy();

      // method under test
      SignOut.clearCookies(req, res, next);

      // expectations and verifications
      expect(next).to.have.been.calledOnce;
      resMock.verify();
    });
  });

  describe('redirectToIdamEndSessionIfSignedIn()', () => {
    it('redirects to the idam end-session url when the auth token cookie was present', () => {
      const req = { cookies: { '__auth-token': 'aToken' } };
      const redirect = sandbox.stub();
      const next = sandbox.stub();
      sandbox.stub(idam, 'buildEndSessionUrl')
        .withArgs(req, paths.idam.signOut)
        .returns('https://idam-web-public/o/endSession?a=b');

      SignOut.redirectToIdamEndSessionIfSignedIn(req, { redirect }, next);

      expect(redirect).to.have.been.calledOnceWith('https://idam-web-public/o/endSession?a=b');
      expect(next).to.not.have.been.called;
    });

    it('calls next without redirecting when there was no auth token cookie', () => {
      const req = { cookies: {} };
      const redirect = sandbox.stub();
      const next = sandbox.stub();

      SignOut.redirectToIdamEndSessionIfSignedIn(req, { redirect }, next);

      expect(redirect).to.not.have.been.called;
      expect(next).to.have.been.calledOnce;
    });
  });
});
