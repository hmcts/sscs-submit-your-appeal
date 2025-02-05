const { expect } = require('test/util/chai');
const SignInBack = require('steps/idam/sign-in-back/SignInBack');
const paths = require('paths');

describe('SignInBack.js', () => {
  let signInBack = null;

  beforeEach(() => {
    signInBack = new SignInBack({
      journey: {
        steps: {
          IdamRedirect: paths.start.idamRedirect
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /sign-in-back', () => {
      expect(signInBack.path).to.equal(paths.idam.signInBack);
    });
  });

  describe('next()', () => {
    it('should redirect to IdamRedirect', () => {
      expect(signInBack.next()).to.eql({
        nextStep: paths.start.idamRedirect
      });
    });
  });
});
