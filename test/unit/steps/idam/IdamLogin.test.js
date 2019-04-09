const { expect } = require('test/util/chai');
const Entry = require('steps/idam/IdamLogin/IdamLogin');
const paths = require('paths');

describe('IdamLogin.js', () => {
  let entry = null;

  beforeEach(() => {
    entry = new Entry({
      journey: {
        steps: {
          Authenticated: paths.idam.authenticated
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /Login', () => {
      expect(Entry.path).to.equal(paths.idam.idamLogin);
    });
  });

  describe('next()', () => {
    it('returns the next step path /authanticated', () => {
      expect(entry.next()).to.eql({ nextStep: paths.idam.authenticated });
    });
  });
});
