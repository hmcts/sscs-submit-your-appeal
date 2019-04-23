const { expect } = require('test/util/chai');
const Entry = require('steps/idam/idam-redirect/IdamRedirect');
const paths = require('paths');

describe('IdamRedirect.js', () => {
  let entry = null;

  beforeEach(() => {
    entry = new Entry({
      journey: {
        steps: {
          HaveAMRN: paths.compliance.haveAMRN
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
    it('returns the next step path /have-you-got-an-mrn', () => {
      expect(entry.next()).to.eql({ nextStep: paths.compliance.haveAMRN });
    });
  });
});
