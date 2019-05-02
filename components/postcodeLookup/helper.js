/* eslint-disable max-len */
/* eslint-disable complexity */

const cleanLine = function(line) {
  return line.replace(' null', ' ').replace('null ', ' ')
    .replace(/undefined/g, '')
    .replace(/ +/g, ' ')
    .trim()
    .replace(/^,/g, '');
};

const buildAddressBaseUk = function(selectedAddress) {
  let line1 = `${selectedAddress.DPA.ORGANISATION_NAME} ${selectedAddress.DPA.DEPARTMENT_NAME} ${selectedAddress.DPA.PO_BOX_NUMBER}`;
  let line2 = `${selectedAddress.DPA.BUILDING_NAME} ${selectedAddress.DPA.SUB_BUILDING_NAME} ${selectedAddress.DPA.BUILDING_NUMBER} ${selectedAddress.DPA.THOROUGHFARE_NAME}`;
  let line3 = `${selectedAddress.DPA.DEPENDENT_LOCALITY} ${selectedAddress.DPA.DOUBLE_DEPENDENT_LOCALITY} ${selectedAddress.DPA.DEPENDENT_THOROUGHFARE_NAME}`;

  if (cleanLine(line1).length === 0) {
    line1 = line2;
    line2 = line3;
    line3 = '';
  }

  const addressBaseUK = {
    addressLine1: cleanLine(line1),
    addressLine2: cleanLine(line2),
    addressLine3: cleanLine(line3),
    postCode: selectedAddress.DPA.POSTCODE,
    postTown: selectedAddress.DPA.POST_TOWN,
    county: '',
    country: 'UK'
  };
  return addressBaseUK;
};

// @todo Refactor this to reduce complexity.

const buildConcatenatedAddress = function(address) {
  let firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.PO_BOX_NUMBER} ${address.DPA.SUB_BUILDING_NAME}  ${address.DPA.BUILDING_NUMBER}, ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.BUILDING_NAME}`;
  let secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY}  ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;

  if (`${address.DPA.BUILDING_NAME}` !== 'undefined') {
    firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME} ${address.DPA.BUILDING_NUMBER}, ${address.DPA.BUILDING_NAME} `;
    secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;
  }

  if (`${address.DPA.BUILDING_NAME}` !== 'undefined' && `${address.DPA.THOROUGHFARE_NAME}` !== 'undefined' && `${address.DPA.BUILDING_NUMBER}` === 'undefined') {
    firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME} ${address.DPA.BUILDING_NAME} `;
    secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;
  }

  if (`${address.DPA.PO_BOX_NUMBER}` !== 'undefined') {
    firstLine = ` ${address.DPA.CLASSIFICATION_CODE_DESCRIPTION} ${address.DPA.PO_BOX_NUMBER}, ${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME}   ${address.DPA.SUB_BUILDING_NAME} ${address.DPA.BUILDING_NUMBER} ${address.DPA.BUILDING_NAME} `;
    secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;
  }

  if (`${address.DPA.BUILDING_NUMBER}` !== 'undefined' && `${address.DPA.SUB_BUILDING_NAME}` !== 'undefined' && `${address.DPA.THOROUGHFARE_NAME}` !== 'undefined') {
    if (`${address.DPA.BUILDING_NAME}` === 'undefined') {
      firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME}`;
      secondLine = `${address.DPA.BUILDING_NUMBER}, ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.DEPENDENT_LOCALITY} `;
    } else {
      firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME}, ${address.DPA.BUILDING_NAME} `;
      secondLine = `${address.DPA.BUILDING_NUMBER}, ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.DEPENDENT_LOCALITY} `;
    }
  }

  if (`${address.DPA.ORGANISATION_NAME}` !== 'undefined' && `${address.DPA.THOROUGHFARE_NAME}` !== 'undefined') {
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

module.exports = { buildAddressBaseUk, buildConcatenatedAddress };