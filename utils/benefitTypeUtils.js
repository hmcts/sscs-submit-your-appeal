const benefitTypes = require('steps/start/benefit-type/types');

const isIba = req =>
  req.session?.BenefitType?.benefitType === benefitTypes.infectedBloodAppeal ||
  req.hostname?.includes('iba') ||
  req.hostname?.includes('infected-blood') ||
  process.env.IS_IBA === 'true';

module.exports = { isIba };