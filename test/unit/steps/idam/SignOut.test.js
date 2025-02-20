const { expect, sinon } = require('test/util/chai');
const SignOut = require('steps/idam/sign-out/SignOut');

const paths = require('paths');

describe('SignOut.js', () => {
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

      const next = sinon.spy();

      // method under test
      SignOut.clearCookies(req, res, next);

      // expectations and verifications
      expect(next).to.have.been.calledOnce;
      resMock.verify();
    });
  });
});
