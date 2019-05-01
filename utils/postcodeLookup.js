
const rp = require('request-promise');
const conf = require('config');

const postCodeLookupUrl = conf.postcodeLookup.url;
const postCodeLookupToken = conf.postcodeLookup.token;
const { buildConcatenatedAddress } = require('utils/postcodeLookupHelper');

// eslint-disable-next-line require-await
const getPostCodeSuggestions = async(req, fieldMap, instance) => {
  const postCode = instance.fields[fieldMap.postcodeLookup].value;
  const options = {
    json: true,
    uri: `${postCodeLookupUrl}/addresses/postcode?postcode=${postCode}&key=${postCodeLookupToken}`,
    method: 'GET'
  };

  return rp(options).then(body => {
    if (body.results && body.results.length > 0) {
      instance.addressSuggestions = body.results;
      req.session.addressSuggestions = instance.addressSuggestions;
    } else {
      instance.fields[fieldMap.postcodeLookup].value = '';
      instance.fields[fieldMap.postcodeLookup].validate();
    }
    Promise.resolve();
  }).catch(() => {
    instance.fields[fieldMap.postcodeLookup].validate();
    Promise.resolve();
  });
};

const resetFields = (req, instance, fieldMap, resetLookupPostCode) => {
  instance.addressSuggestions = [];
  req.session.addressSuggestions = [];
  instance.fields[fieldMap.postcodeAddress].value = '';
  instance.fields[fieldMap.line1].value = '';
  instance.fields[fieldMap.line2].value = '';
  instance.fields[fieldMap.town].value = '';
  instance.fields[fieldMap.county].value = '';
  instance.fields[fieldMap.postCode].value = '';

  if (resetLookupPostCode) {
    instance.fields[fieldMap.postcodeLookup].value = '';
  }
};

const fillAddressForm = (req, instance, fieldMap) => {
  let selectedAddress = [];
  instance.parse();

  // eslint-disable-next-line max-len
  if (instance.fields[fieldMap.postcodeAddress].validate() && instance.addressSuggestions) {
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
  instance.store();
  instance.res.render(instance.template, instance.locals);
  return Promise.resolve(false);
};

const addressLookup = async(req, instance, fieldMap) => {
  instance.parse();
  resetFields(req, instance, fieldMap);
  // Get suggestions.
  await getPostCodeSuggestions(req, fieldMap, instance);

  instance.store();
  instance.res.render(instance.template, instance.locals);
  return Promise.resolve(false);
};

const isManual = (req, instance, fieldMap) => {
  instance.postcodeLookupType = 'auto';

  if (req.query.type && req.query.type === 'auto') {
    req.session.postcodeLookupType = 'auto';
    resetFields(req, instance, fieldMap, true);
    instance.store();
    return false;
  }

  if (req.session.postcodeLookupType === 'manual' ||
     (req.query.type && req.query.type === 'manual')) {
    req.session.postcodeLookupType = 'manual';
    instance.postcodeLookupType = 'manual';

    resetFields(req, instance, fieldMap, true);
    instance.store();

    return true;
  }

  return false;
};

const postCodeLookup = (req, instance, fieldMap) => {
  // try to retrieve session field values
  instance.retrieve();

  if (isManual(req, instance, fieldMap)) {
    return Promise.resolve(true);
  }


  // try to retrive addressSuggestions.
  if (req.session.addressSuggestions) {
    instance.addressSuggestions = req.session.addressSuggestions;
  }

  if (req.body.submitType === 'lookup') {
    return addressLookup(req, instance, fieldMap);
  }

  if (req.body.submitType === 'addressSelection') {
    return fillAddressForm(req, instance, fieldMap);
  }

  return Promise.resolve(true);
};

module.exports = { postCodeLookup };