/* eslint-disable no-magic-numbers, max-len */

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

const formatMobileNumber = mobileNumber => {
  let formattedNumber = null;

  const mobNumber = mobileNumber.replace(/\s/g, '');

  if (mobNumber.length > 11 && mobNumber.includes('+')) {
    formattedNumber = `${mobNumber.substring(0, 3)} ${mobNumber.substring(3, 7)} ${mobNumber.substring(7, 10)} ${mobNumber.substring(10)}`;
  } else if (mobNumber.length > 11 && !mobNumber.includes('+')) {
    formattedNumber = `${mobNumber.substring(0, 2)} ${mobNumber.substring(2, 6)} ${mobNumber.substring(6, 9)} ${mobNumber.substring(9)}`;
  } else {
    formattedNumber = `${mobNumber.substring(0, 4)} ${mobNumber.substring(4, 7)} ${mobNumber.substring(7)}`;
  }
  return formattedNumber;
};

module.exports = { titleise, splitBenefitType, formatMobileNumber };
