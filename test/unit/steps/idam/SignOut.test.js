const { expect, sinon } = require('test/util/chai');
const SignOut = require('steps/idam/sign-out/SignOut');
const idam = require('middleware/idam');
const paths = require('paths');

describe('SignOut.js', () => {
  describe('get path()', () => {
    let signOut = null;
    beforeEach(() => {
      signOut = new SignOut({
        journey: {
          steps: {}
        }
      });
    });
    it('returns path /exit', () => {
      expect(SignOut.path).to.equal(paths.idam.signOut);
    });
    it('expects middleware', () => {
      const authenticateMock = sinon.stub(idam, 'protect');
      expect(signOut.middleware[0]).to.equal(authenticateMock);
    });
  });
});
