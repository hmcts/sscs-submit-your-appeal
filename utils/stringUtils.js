/* eslint-disable no-magic-numbers, max-len, no-undefined */
const Entities = require('html-entities').XmlEntities;
const benefitTypes = require('steps/start/benefit-type/types');

const MIN_CHAR_COUNT = 5;
const isNotEmptyString = value => value !== undefined && value.length > 0;
const isGreaterThanOrEqualToFiveCharacters = value => value.replace(/\s\s+/g, ' ').length >= MIN_CHAR_COUNT;
const config = require('config');

const featureFlagOverrides = {};

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

  if (benefitType.includes('(') && benefitType.includes(')')) {
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
    carersAllowance: 'judge',
    attendanceAllowance: 'judge, doctor and disability expert',
    bereavementBenefit: 'judge',
    UC: 'judge and for some appeals, a doctor'
  }[key];
};

const getTribunalPanelWelsh = ben => {
  const key = splitBenefitType(ben).code;
  return {
    PIP: 'barnwr, meddyg ac arbenigwr anabledd',
    DLA: 'barnwr, meddyg ac arbenigwr anabledd',
    ESA: 'barnwr a meddyg',
    carersAllowance: 'barnwr',
    attendanceAllowance: 'barnwr, meddyg ac arbenigwr anabledd',
    bereavementBenefit: 'barnwr',
    UC: 'barnwr ac, ar gyfer rhai apeliadau, meddyg'
  }[key];
};

const decode = field => {
  const entities = new Entities();
  return entities.decode(field);
};

module.exports = {
  isFeatureFlagEnabled,
  titleise,
  splitBenefitType,
  isNotEmptyString,
  isGreaterThanOrEqualToFiveCharacters,
  getBenefitCode,
  getTribunalPanel,
  getTribunalPanelWelsh,
  getBenefitName,
  decode,
  getHasAcronym,
  getBenefitEndText,
  getBenefitEndTextWelsh,
  overrideFeatFlag
};
