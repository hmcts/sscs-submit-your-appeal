const { expect } = require('test/util/chai');
const { isIba } = require('utils/benefitTypeUtils');
const benefitTypes = require('steps/start/benefit-type/types');

describe('isIba() test', () => {
  it('should return false if no req.session.BenefitType', () => {
    const req = {
      session: {}
    };
    expect(isIba(req)).to.be.false;
  });

  it('should return false if req.session.BenefitType.benefitType is not iba', () => {
    const req = {
      session: {
        BenefitType: {
          benefitType: ''
        }
      }
    };
    expect(isIba(req)).to.be.false;
  });

  it('should return true if req.session.BenefitType.benefitType not iba', () => {
    const req = {
      session: {
        BenefitType: {
          benefitType: benefitTypes.infectedBloodCompensation
        }
      }
    };
    expect(isIba(req)).to.be.true;
  });

  it('should return true if req.hostname.includes iba', () => {
    const req = {
      hostname: 'some-iba-hostname'
    };
    expect(isIba(req)).to.be.true;
  });

  it('should return true if req.hostname.includes infected-blood-appeal', () => {
    const req = {
      hostname: 'some-infected-blood-appeal-hostname'
    };
    expect(isIba(req)).to.be.true;
  });

  it('should return true if env var IS_IBA is true ', () => {
    // eslint-disable-next-line no-process-env
    process.env.IS_IBA = 'true';
    const req = {};
    expect(isIba(req)).to.be.true;
    // eslint-disable-next-line no-process-env
    process.env.IS_IBA = 'false';
  });
});
