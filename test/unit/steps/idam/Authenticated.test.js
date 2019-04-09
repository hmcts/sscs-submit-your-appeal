const { expect } = require('test/util/chai');
const Entry = require('steps/idam/authenticated/Authenticated');
const paths = require('paths');

describe('Authenticated.js', () => {
  let entry = null;

  beforeEach(() => {
    entry = new Entry({
      journey: {
        steps: {
          CheckYourAppeal: paths.checkYourAppeal
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /authenticated', () => {
      expect(Entry.path).to.equal(paths.idam.authenticated);
    });
  });

  describe('next()', () => {
    it('returns the next step path /check-your-appeal', () => {
      expect(entry.next()).to.eql({ nextStep: paths.checkYourAppeal });
    });
  });
});
