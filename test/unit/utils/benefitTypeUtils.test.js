const { expect } = require('test/util/chai');
const { isIba, getAllowedBenefitTypes } = require('utils/benefitTypeUtils');
const benefitTypes = require('steps/start/benefit-type/types');
const { overrideFeatFlag } = require('utils/stringUtils');

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

describe('getAllowedBenefitTypes() test', () => {
  const allowedTypes = [
    benefitTypes.personalIndependencePayment,
    benefitTypes.employmentAndSupportAllowance,
    benefitTypes.universalCredit,
    benefitTypes.infectedBloodCompensation
  ];
  before(() => {
    overrideFeatFlag({ key: 'allowDLA', value: false });
    overrideFeatFlag({ key: 'allowCA', value: false });
    overrideFeatFlag({ key: 'allowAA', value: false });
    overrideFeatFlag({ key: 'allowBB', value: false });
    overrideFeatFlag({ key: 'allowIIDB', value: false });
    overrideFeatFlag({ key: 'allowJSA', value: false });
    overrideFeatFlag({ key: 'allowSF', value: false });
    overrideFeatFlag({ key: 'allowMA', value: false });
    overrideFeatFlag({ key: 'allowIS', value: false });
    overrideFeatFlag({ key: 'allowBSPS', value: false });
    overrideFeatFlag({ key: 'allowIDB', value: false });
    overrideFeatFlag({ key: 'allowPC', value: false });
    overrideFeatFlag({ key: 'allowRP', value: false });
  });
  it('returns base list when no feature flags on', () => {
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowDLA feature flag on', () => {
    overrideFeatFlag({ key: 'allowDLA', value: true });
    allowedTypes.push(benefitTypes.disabilityLivingAllowance);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowCA feature flag on', () => {
    overrideFeatFlag({ key: 'allowCA', value: true });
    allowedTypes.push(benefitTypes.carersAllowance);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowAA feature flag on', () => {
    overrideFeatFlag({ key: 'allowAA', value: true });
    allowedTypes.push(benefitTypes.attendanceAllowance);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowBB feature flag on', () => {
    overrideFeatFlag({ key: 'allowBB', value: true });
    allowedTypes.push(benefitTypes.bereavementBenefit);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowIIDB feature flag on', () => {
    overrideFeatFlag({ key: 'allowIIDB', value: true });
    allowedTypes.push(benefitTypes.industrialInjuriesDisablement);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowJSA feature flag on', () => {
    overrideFeatFlag({ key: 'allowJSA', value: true });
    allowedTypes.push(benefitTypes.jobseekersAllowance);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowSF feature flag on', () => {
    overrideFeatFlag({ key: 'allowSF', value: true });
    allowedTypes.push(benefitTypes.socialFund);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowMA feature flag on', () => {
    overrideFeatFlag({ key: 'allowMA', value: true });
    allowedTypes.push(benefitTypes.maternityAllowance);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowIS feature flag on', () => {
    overrideFeatFlag({ key: 'allowIS', value: true });
    allowedTypes.push(benefitTypes.incomeSupport);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowBSPS feature flag on', () => {
    overrideFeatFlag({ key: 'allowBSPS', value: true });
    allowedTypes.push(benefitTypes.bereavementSupportPaymentScheme);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowIDB feature flag on', () => {
    overrideFeatFlag({ key: 'allowIDB', value: true });
    allowedTypes.push(benefitTypes.industrialDeathBenefit);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowPC feature flag on', () => {
    overrideFeatFlag({ key: 'allowPC', value: true });
    allowedTypes.push(benefitTypes.pensionCredit);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
  it('returns updated list when allowRP feature flag on', () => {
    overrideFeatFlag({ key: 'allowRP', value: true });
    allowedTypes.push(benefitTypes.retirementPension);
    expect(getAllowedBenefitTypes()).to.eql(allowedTypes);
  });
});
