const { expect } = require('test/util/chai');
const benefitTypeUtils = require('utils/benefitTypeUtils');
const benefitTypes = require('steps/start/benefit-type/types');

describe('isIba() test', () => {
  it('should return false if no req.session.BenefitType', () => {
    const req = {
      session: {}
    };
    expect(benefitTypeUtils.isIba(req)).to.be.false;
  });

  it('should return false if req.session.BenefitType.benefitType is not iba', () => {
    const req = {
      session: {
        BenefitType: {
          benefitType: ''
        }
      }
    };
    expect(benefitTypeUtils.isIba(req)).to.be.false;
  });

  it('should return true if req.session.BenefitType.benefitType not iba', () => {
    const req = {
      session: {
        BenefitType: {
          benefitType: benefitTypes.infectedBloodAppeal
        }
      }
    };
    expect(benefitTypeUtils.isIba(req)).to.be.true;
  });
});
