const benefitTypes = require('steps/start/benefit-type/types');

const isIba = req => Object.hasOwn(req.session, 'BenefitType') && req.session.BenefitType.benefitType === benefitTypes.infectedBloodAppeal;

module.exports = { isIba };