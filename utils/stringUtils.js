/* eslint-disable no-magic-numbers, max-len, no-undefined */
const { decode } = require('html-entities');
const benefitTypes = require('steps/start/benefit-type/types');

const MIN_CHAR_COUNT = 5;
const isNotEmptyString = value => value !== undefined && value.length > 0;
const isGreaterThanOrEqualToFiveCharacters = value => value.replace(/\s\s+/g, ' ').length >= MIN_CHAR_COUNT;
const config = require('config');

const featureFlagOverrides = {};

const maskNino = nino => (nino ? `XXXX${nino.slice(4)}` : 'not submitted yet');
const getIbcaReference = ibcaReference => ibcaReference || 'not submitted yet';
const overrideFeatFlag = override => {
  featureFlagOverrides[override.key] = override.value;
};

const isFeatureFlagEnabled = featureFlag => {
  const featureFlagName = `features.${featureFlag}.enabled`;

  if (Object.keys(featureFlagOverrides).find(key => key === featureFlag)) {
    return featureFlagOverrides[featureFlag];
  }
  return config.get(featureFlagName) === 'true';
};

const titleise = string => {
  if (typeof string === 'undefined' || string === null) {
    return '';
  }

  if (string.length < 1) {
    return string;
  }
  const firstChar = string[0].toUpperCase();
  const rest = string.slice(1)
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();

  return `${firstChar}${rest}`;
};

const splitBenefitType = benefitType => {
  let code = '';
  let description = benefitType;

  if (benefitType && benefitType.includes('(') && benefitType.includes(')')) {
    const index = benefitType.indexOf('(');
    description = benefitType.substring(0, index).trim();
    code = benefitType.substring(index, benefitType.length)
      .replace('(', '')
      .replace(')', '');
  } else {
    const keys = Object.keys(benefitTypes);
    const res = keys.find(key => benefitTypes[key] === benefitType);
    code = res;
  }

  return { description, code };
};

const hasAcronym = benefitType => (benefitType.includes('(') && benefitType.includes(')'));

const doesBenefitContainTheWordBenefit = benefitType => (benefitType.includes('Benefit'));

const getBenefitCode = ben => splitBenefitType(ben).code;

const getBenefitName = ben => splitBenefitType(ben).description;

const getHasAcronym = ben => hasAcronym(ben);

const getBenefitEndText = ben => {
  if (!doesBenefitContainTheWordBenefit(ben)) {
    return ' benefit';
  }
  return '';
};

const getBenefitEndTextWelsh = ben => {
  if (!doesBenefitContainTheWordBenefit(ben)) {
    return 'budd-dal ';
  }
  return '';
};

const getTribunalPanel = ben => {
  const key = splitBenefitType(ben).code;
  return {
    PIP: 'judge, doctor and disability expert',
    DLA: 'judge, doctor and disability expert',
    ESA: 'judge and a doctor',
    JSA: 'judge',
    carersAllowance: 'judge',
    attendanceAllowance: 'judge, doctor and disability expert',
    bereavementBenefit: 'judge',
    maternityAllowance: 'judge',
    bereavementSupportPaymentScheme: 'judge',
    pensionCredit: 'judge',
    retirementPension: 'judge',
    socialFund: 'judge',
    incomeSupport: 'judge',
    UC: 'judge and for some appeals, a doctor',
    industrialInjuriesDisablement: 'judge and 1 or 2 doctors',
    industrialDeathBenefit: 'judge and 1 or 2 doctors',
    infectedBloodCompensation: 'judge and if appropriate, a doctor and or a financial expert'
  }[key];
};

const getTribunalPanelWelsh = ben => {
  const key = splitBenefitType(ben).code;
  return {
    PIP: 'barnwr, meddyg ac arbenigwr anabledd',
    DLA: 'barnwr, meddyg ac arbenigwr anabledd',
    ESA: 'barnwr a meddyg',
    JSA: 'barnwr',
    carersAllowance: 'barnwr',
    attendanceAllowance: 'barnwr, meddyg ac arbenigwr anabledd',
    bereavementBenefit: 'barnwr',
    maternityAllowance: 'barnwr',
    bereavementSupportPaymentScheme: 'barnwr',
    pensionCredit: 'barnwr',
    retirementPension: 'barnwr',
    socialFund: 'barnwr',
    incomeSupport: 'barnwr',
    UC: 'barnwr ac, ar gyfer rhai apeliadau, meddyg',
    industrialInjuriesDisablement: 'barnwr ac 1 neu 2 feddyg',
    industrialDeathBenefit: 'barnwr ac 1 neu 2 feddyg',
    infectedBloodCompensation: 'barnwr ac if appropriate, a doctor and or a financial expert'
  }[key];
};

const decodeText = field => decode(field);

module.exports = {
  maskNino,
  getIbcaReference,
  isFeatureFlagEnabled,
  titleise,
  splitBenefitType,
  isNotEmptyString,
  isGreaterThanOrEqualToFiveCharacters,
  getBenefitCode,
  getTribunalPanel,
  getTribunalPanelWelsh,
  getBenefitName,
  decode: decodeText,
  getHasAcronym,
  getBenefitEndText,
  getBenefitEndTextWelsh,
  overrideFeatFlag
};
