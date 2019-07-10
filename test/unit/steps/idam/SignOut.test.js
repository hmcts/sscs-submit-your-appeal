const { expect, sinon } = require('test/util/chai');
const SignOut = require('steps/idam/sign-out/SignOut');
const idam = require('middleware/idam');
const paths = require('paths');

describe('SignOut.js', () => {
  describe('get path()', () => {
    it('returns path /exit', () => {
      expect(SignOut.path).to.equal(paths.idam.signOut);
    });
    it('expects middleware', () => {
      const logoutMock = sinon.stub(idam, 'logout');
      const signOut = new SignOut({
        journey: {
          steps: {}
        }
      });
      expect(signOut.middleware[0]).to.equal(logoutMock);
    });
  });
});
