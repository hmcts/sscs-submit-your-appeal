/* eslint-disable max-len */
/* eslint-disable complexity */

const cleanLine = function (line) {
  return line
    .replace(' null', ' ')
    .replace('null ', ' ')
    .replace(/undefined/g, '')
    .replace(/ +/g, ' ')
    .trim()
    .replace(/^,/g, '');
};

const buildConcatenatedAddress = function (address) {
  let firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.PO_BOX_NUMBER} ${address.DPA.SUB_BUILDING_NAME}  ${address.DPA.BUILDING_NUMBER}, ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.BUILDING_NAME}`;
  let secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY}  ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;

  if (`${address.DPA.BUILDING_NAME}` !== 'undefined') {
    firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME} ${address.DPA.BUILDING_NUMBER}, ${address.DPA.BUILDING_NAME} `;
    secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;
  }

  if (
    `${address.DPA.BUILDING_NAME}` !== 'undefined' &&
    `${address.DPA.THOROUGHFARE_NAME}` !== 'undefined' &&
    `${address.DPA.BUILDING_NUMBER}` === 'undefined'
  ) {
    firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME} ${address.DPA.BUILDING_NAME} `;
    secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;
  }

  if (`${address.DPA.PO_BOX_NUMBER}` !== 'undefined') {
    firstLine = ` ${address.DPA.CLASSIFICATION_CODE_DESCRIPTION} ${address.DPA.PO_BOX_NUMBER}, ${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME}   ${address.DPA.SUB_BUILDING_NAME} ${address.DPA.BUILDING_NUMBER} ${address.DPA.BUILDING_NAME} `;
    secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;
  }

  if (
    `${address.DPA.BUILDING_NUMBER}` !== 'undefined' &&
    `${address.DPA.SUB_BUILDING_NAME}` !== 'undefined' &&
    `${address.DPA.THOROUGHFARE_NAME}` !== 'undefined'
  ) {
    if (`${address.DPA.BUILDING_NAME}` === 'undefined') {
      firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME}`;
      secondLine = `${address.DPA.BUILDING_NUMBER}, ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.DEPENDENT_LOCALITY} `;
    } else {
      firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME}, ${address.DPA.BUILDING_NAME} `;
      secondLine = `${address.DPA.BUILDING_NUMBER}, ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.DEPENDENT_LOCALITY} `;
    }
  }

  if (
    `${address.DPA.ORGANISATION_NAME}` !== 'undefined' &&
    `${address.DPA.THOROUGHFARE_NAME}` !== 'undefined'
  ) {
    firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME}`;
    secondLine = `${address.DPA.BUILDING_NUMBER} ${address.DPA.SUB_BUILDING_NAME} ${address.DPA.BUILDING_NAME}, ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY}`;
  }

  const concatenatedAddress = {
    line1: cleanLine(firstLine),
    line2: cleanLine(secondLine),
    town: address.DPA.POST_TOWN,
    county: address.DPA.DEPENDENT_LOCALITY || address.DPA.POST_TOWN,
    postCode: address.DPA.POSTCODE
  };

  return concatenatedAddress;
};

module.exports = { buildConcatenatedAddress, cleanLine };
