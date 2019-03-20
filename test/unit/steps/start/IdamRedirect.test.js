const { expect } = require('test/util/chai');
const Entry = require('steps/start/idam-redirect/IdamRedirect');
const paths = require('paths');

describe('IdamRedirect.js', () => {
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
    it('returns path /idam-redirect', () => {
      expect(Entry.path).to.equal(paths.start.idamRedirect);
    });
  });

  describe('next()', () => {
    it('returns the next step path /benefit-type', () => {
      expect(entry.next()).to.eql({ nextStep: paths.checkYourAppeal });
    });
  });
});
