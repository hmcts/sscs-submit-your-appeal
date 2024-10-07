const { expect } = require('test/util/chai');
const Entry = require('steps/idam/idam-redirect/IdamRedirect');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');

describe('IdamRedirect.js', () => {
  let entry = null;

  beforeEach(() => {
    entry = new Entry({
      journey: {
        steps: {
          HaveAMRN: paths.compliance.haveAMRN,
          HaveAnIRN: paths.compliance.haveAnIRN,
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
      expect(entry.next().step).to.eql(paths.start.benefitType);
    });

    it('should redirect to HaveAMRN if benefit type is non IBA', () => {
      entry.req = {
        session: {
          BenefitType: {
            benefitType: benefitTypes.personalIndependencePayment
          }
        }
      };
      expect(entry.next().step).to.eql(paths.compliance.haveAMRN);
    });

    it('should redirect to NeedAnIRN if benefit type is IBA', () => {
      entry.req = {
        session: {
          BenefitType: {
            benefitType: benefitTypes.infectedBloodAppeal
          }
        }
      };

      expect(entry.next().step).to.eql(paths.compliance.haveAnIRN);
    });
  });
});
