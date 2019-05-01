
const rp = require('request-promise');
const conf = require('config');

const postCodeLookupUrl = conf.postcodeLookup.url;
const postCodeLookupToken = conf.postcodeLookup.token;
const { buildConcatenatedAddress } = require('utils/postcodeLookupHelper');

// eslint-disable-next-line require-await
const getPostCodeSuggestions = async(req, fieldMap, instance) => {
  const postCode = instance.fields[fieldMap.postcode].value;
  const options = {
    json: true,
    uri: `${postCodeLookupUrl}/addresses/postcode?postcode=${postCode}&key=${postCodeLookupToken}`,
    method: 'GET'
  };

  return rp(options).then(body => {
    if (body.results.length > 0) {
      instance.addressSuggestions = body.results;
      req.session.addressSuggestions = instance.addressSuggestions;
      Promise.resolve();
    }
  }).catch(() => Promise.resolve());
};

const fillAddressForm = (req, instance, fieldMap) => {
  let selectedAddress = [];

  if (instance.fields[fieldMap.postcodeAddress].validate()) {
    const selectedUPRN = instance.fields[fieldMap.postcodeAddress].value;
    if (selectedUPRN) {
      // eslint-disable-next-line max-len
      selectedAddress = instance.addressSuggestions.filter(address => address.DPA.UPRN === selectedUPRN);
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
};

const addressLookup = async(req, instance, fieldMap) => {
  if (instance.fields[fieldMap.postcode].validate()) {
    // Get suggestions.
    await getPostCodeSuggestions(req, fieldMap, instance);
    fillAddressForm(req, instance, fieldMap);
  } else {
    instance.fields[fieldMap.postcodeAddress].value = '';
    instance.addressSuggestions = [];
    req.session.addressSuggestions = [];
  }
};

const postCodeLookup = async(req, instance, fieldMap) => {
  // try to retrieve session field values
  instance.retrieve();
  // try to retrive addressSuggestions.
  if (req.session.addressSuggestions) {
    instance.addressSuggestions = req.session.addressSuggestions;
  }

  if (req.body.submitType === 'lookup' ||
    !instance.fields[fieldMap.postcodeAddress].value ||
    !instance.fields[fieldMap.postcode].value ||
    !instance.addressSuggestions) {
    instance.parse();
    await addressLookup(req, instance, fieldMap);
    instance.store();
    instance.res.render(instance.template, instance.locals);
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};

module.exports = { postCodeLookup };