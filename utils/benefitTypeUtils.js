const benefitTypes = require('steps/start/benefit-type/types');
const { isFeatureFlagEnabled } = require('utils/stringUtils');

const isIba = req =>
  req.session?.BenefitType?.benefitType ===
    benefitTypes.infectedBloodCompensation ||
  req.hostname?.includes('iba') ||
  req.hostname?.includes('infected-blood') ||
  process.env.IS_IBA === 'true';

const getAllowedBenefitTypes = () => {
  const allowedTypes = [
    benefitTypes.personalIndependencePayment,
    benefitTypes.employmentAndSupportAllowance,
    benefitTypes.universalCredit,
    benefitTypes.infectedBloodCompensation
  ];

  const featureFlags = [
    { flag: 'allowDLA', benefit: benefitTypes.disabilityLivingAllowance },
    { flag: 'allowCA', benefit: benefitTypes.carersAllowance },
    { flag: 'allowAA', benefit: benefitTypes.attendanceAllowance },
    { flag: 'allowBB', benefit: benefitTypes.bereavementBenefit },
    {
      flag: 'allowIIDB',
      benefit: benefitTypes.industrialInjuriesDisablement
    },
    { flag: 'allowJSA', benefit: benefitTypes.jobseekersAllowance },
    { flag: 'allowSF', benefit: benefitTypes.socialFund },
    { flag: 'allowMA', benefit: benefitTypes.maternityAllowance },
    { flag: 'allowIS', benefit: benefitTypes.incomeSupport },
    {
      flag: 'allowBSPS',
      benefit: benefitTypes.bereavementSupportPaymentScheme
    },
    { flag: 'allowIDB', benefit: benefitTypes.industrialDeathBenefit },
    { flag: 'allowPC', benefit: benefitTypes.pensionCredit },
    { flag: 'allowRP', benefit: benefitTypes.retirementPension }
  ];

  allowedTypes.push(
    ...featureFlags
      .filter(f => isFeatureFlagEnabled(f.flag))
      .map(f => f.benefit)
  );

  return allowedTypes;
};

module.exports = { isIba, getAllowedBenefitTypes };
