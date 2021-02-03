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
          BenefitType: paths.start.benefitType
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
    it('should redirect to BenefitType if there is no benefit type', () => {
      entry.req = {
        session: {}
      };
      expect(entry.next()).to.eql({
        nextStep: paths.start.benefitType
      });
    });
  });

  describe('next()', () => {
    it('should redirect to HaveAMRN if there is benefit type', () => {
      entry.req = {
        session: {
          BenefitType: 'Personal Independence Payment (PIP)'
        }
      };

      expect(entry.next()).to.eql({
        nextStep: paths.compliance.haveAMRN
      });
    });
  });
});
