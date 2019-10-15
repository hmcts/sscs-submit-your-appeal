const { expect } = require('test/util/chai');
const Entry = require('steps/idam/idam-redirect/IdamRedirect');
const paths = require('paths');

describe('IdamRedirect.js', () => {
  let entry = null;

  beforeEach(() => {
    entry = new Entry({
      journey: {
        steps: {
          HaveAMRN: paths.compliance.haveAMRN,
          Entry: paths.session.entry
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
      entry.req = {
        session: {
          BenefitType: {
            benefitType: null
          }
        }
      };

      expect(entry.next()).to.eql({ nextStep: paths.compliance.haveAMRN });
    });
  });

  describe('next()', () => {
    it('returns the next step path /have-you-got-an-mrn', () => {
      entry.req = {
        session: {
          BenefitType: paths.BenefitType
        }
      };

      expect(entry.next()).to.eql({ nextStep: paths.session.entry });
    });
  });
});
