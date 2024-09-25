const benefitTypes = require('steps/start/benefit-type/types');
const _ = require('lodash');

const isIba = req =>
  req.session?.BenefitType?.benefitType === benefitTypes.infectedBloodAppeal ||
  req.hostname?.includes('iba-') || !_.isUndefined(req.query?.forceIba);

module.exports = { isIba };