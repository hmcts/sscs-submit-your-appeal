const benefitTypes = require('steps/start/benefit-type/types');

const isIba = req =>
  (Object.hasOwn(req.session || {}, 'BenefitType') && req.session.BenefitType.benefitType === benefitTypes.infectedBloodAppeal) ||
  (req.hostname && req.hostname.includes('iba-')) ||
  (Object.hasOwn(req.query || {}, 'forceIba'));

module.exports = { isIba };