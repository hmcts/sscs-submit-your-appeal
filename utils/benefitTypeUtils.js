const benefitTypes = require('steps/start/benefit-type/types');

const isIba = req =>
  req.session?.BenefitType?.benefitType === benefitTypes.infectedBloodAppeal ||
  req.hostname?.includes('iba-') || process.env.IS_IBA === 'true';

module.exports = { isIba };