/* eslint-disable no-magic-numbers, max-len, no-undefined */
const Entities = require('html-entities').XmlEntities;

const MIN_CHAR_COUNT = 5;
const isNotEmptyString = value => value !== undefined && value.length > 0;
const isGreaterThanOrEqualToFiveCharacters = value => value.replace(/\s\s+/g, ' ').length >= MIN_CHAR_COUNT;

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
  }

  return { description, code };
};

const getBenefitCode = ben => splitBenefitType(ben).code;

const getBenefitName = ben => splitBenefitType(ben).description;

const getTribunalPanel = ben => {
  const key = splitBenefitType(ben).code;
  return {
    PIP: 'judge, doctor and disability expert',
    DLA: 'judge and a doctor',
    ESA: 'judge and a doctor'
  }[key];
};

const decode = field => {
  const entities = new Entities();
  return entities.decode(field);
};

module.exports = {
  titleise,
  splitBenefitType,
  isNotEmptyString,
  isGreaterThanOrEqualToFiveCharacters,
  getBenefitCode,
  getTribunalPanel,
  getBenefitName,
  decode
};
