
const rp = require('request-promise');
const conf = require('config');

const postCodeLookupUrl = conf.postcodeLookup.url;
const postCodeLookupToken = conf.postcodeLookup.token;
const { buildConcatenatedAddress } = require('utils/postcodeLookupHelper');

// eslint-disable-next-line require-await
const getPostCodeSuggestions = async(fieldMap, instance) => {
  const postCode = instance.fields[fieldMap.postcode].value;
  const options = {
    json: true,
    uri: `${postCodeLookupUrl}/addresses/postcode?postcode=${postCode}&key=${postCodeLookupToken}`,
    method: 'GET'
  };

  return rp(options).then(body => {
    if (body.results.length > 0) {
      instance.fields[fieldMap.postCodeOptions].value = body.results;
      Promise.resolve();
    }
  }).catch(() => Promise.resolve());
};
const addressLookup = async(instance, fieldMap) => {
  instance.parse();

  if (instance.fields[fieldMap.postcode].validate()) {
    // Get suggestions.
    await getPostCodeSuggestions(fieldMap, instance);
  } else {
    instance.fields[fieldMap.postcodeAddress].value = '';
  }

  instance.store();
  instance.res.render(instance.template, instance.locals);
};

const fillAddressForm = async(req, instance, fieldMap) => {
  instance.parse();
  let selectedAddress = [];

  // eslint-disable-next-line max-len
  if (instance.fields[fieldMap.postcodeAddress].value && instance.fields[fieldMap.postcodeAddress].validate()) {
    const selectedUPRN = instance.fields[fieldMap.postcodeAddress].value;
    if (selectedUPRN) {
      // Get suggestions.
      await getPostCodeSuggestions(fieldMap, instance);
      // eslint-disable-next-line max-len
      selectedAddress = instance.fields[fieldMap.postCodeOptions].value.filter(address => address.DPA.UPRN === selectedUPRN);
    }
  }

  if (selectedAddress.length === 1) {
    const concatenated = buildConcatenatedAddress(selectedAddress[0]);

    instance.fields[fieldMap.line1].value = concatenated.line1;
    instance.fields[fieldMap.line2].value = concatenated.line2;
    instance.fields[fieldMap.town].value = concatenated.town;
    instance.fields[fieldMap.county].value = concatenated.county;
    instance.fields[fieldMap.postCode].value = concatenated.postCode;
    instance.validate();
  }

  instance.store();
  instance.res.render(instance.template, instance.locals);
};

const postCodeLookup = (req, instance, fieldMap) => {
  if (req.body.submitType && req.body.submitType === 'addressLookup') {
    addressLookup(instance, fieldMap);
    return false;
  } else if (req.body.submitType && req.body.submitType === 'addressSelection') {
    fillAddressForm(req, instance, fieldMap);
    return false;
  }

  return true;
};

module.exports = { postCodeLookup };