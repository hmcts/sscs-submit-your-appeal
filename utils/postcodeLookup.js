
const rp = require('request-promise');
const conf = require('config');
const { includes } = require('lodash');
const { form } = require('@hmcts/one-per-page/forms');

const postCodeLookupUrl = conf.postcodeLookup.url;
const postCodeLookupToken = conf.postcodeLookup.token;
const { buildConcatenatedAddress } = require('utils/postcodeLookupHelper');

const postcodeFieldNames = {
  postcodeLookup: 'postCodeLookup',
  postcodeAddress: 'postcodeAddress',
  line1: 'addressLine1',
  line2: 'addressLine2',
  town: 'townCity',
  county: 'county',
  postCode: 'postCode'
};

let disabledFields = [];

// const postcodeLookupFields = () => {
//   disabledFields = [
//     postcodeFieldNames.postcodeAddress,
//     postcodeFieldNames.line1,
//     postcodeFieldNames.line2,
//     postcodeFieldNames.town,
//     postcodeFieldNames.county,
//     postcodeFieldNames.postCode
//   ];
// };

const manualFileds = () => {
  disabledFields = [
    postcodeFieldNames.postcodeLookup,
    postcodeFieldNames.postcodeAddress
  ];
};

const resetDisabledFields = () => {
  disabledFields = [];
};

const postCodeForm = fields => {
  const newForm = Object.create(null);
  for (let i = 0; i < fields.length; i++) {
    if (!includes(disabledFields, fields[i].name)) {
      newForm[fields[i].name] = fields[i].validator;
    }
  }

  return form(newForm);
};

// eslint-disable-next-line require-await
const getPostCodeSuggestions = async(req, instance) => {
  const postCode = instance.fields[postcodeFieldNames.postcodeLookup].value;
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
      instance.fields[postcodeFieldNames.postcodeLookup].value = '';
      instance.fields[postcodeFieldNames.postcodeLookup].validate();
    }
    Promise.resolve();
  }).catch(() => {
    instance.fields[postcodeFieldNames.postcodeLookup].validate();
    Promise.resolve();
  });
};

const resetFields = (req, instance, resetLookupPostCode) => {
  instance.addressSuggestions = [];
  req.session.addressSuggestions = [];
  instance.fields[postcodeFieldNames.postcodeAddress].value = '';
  instance.fields[postcodeFieldNames.line1].value = '';
  instance.fields[postcodeFieldNames.line2].value = '';
  instance.fields[postcodeFieldNames.town].value = '';
  instance.fields[postcodeFieldNames.county].value = '';
  instance.fields[postcodeFieldNames.postCode].value = '';

  if (resetLookupPostCode) {
    instance.fields[postcodeFieldNames.postcodeLookup].value = '';
  }
};

const fillAddressForm = (req, instance) => {
  let selectedAddress = [];
  instance.parse();

  // eslint-disable-next-line max-len
  if (instance.fields[postcodeFieldNames.postcodeAddress].validate() && instance.addressSuggestions) {
    const selectedUPRN = instance.fields[postcodeFieldNames.postcodeAddress].value;
    if (selectedUPRN) {
      // eslint-disable-next-line max-len
      selectedAddress = instance.addressSuggestions.filter(address => address.DPA.UPRN === selectedUPRN);
    }
  }

  if (selectedAddress.length === 1) {
    const concatenated = buildConcatenatedAddress(selectedAddress[0]);

    instance.fields[postcodeFieldNames.line1].value = concatenated.line1;
    instance.fields[postcodeFieldNames.line2].value = concatenated.line2;
    instance.fields[postcodeFieldNames.town].value = concatenated.town;
    instance.fields[postcodeFieldNames.county].value = concatenated.county;
    instance.fields[postcodeFieldNames.postCode].value = concatenated.postCode;
    instance.validate();
  }
  instance.store();
  instance.res.render(instance.template, instance.locals);
  return Promise.resolve(false);
};

const addressLookup = async(req, instance) => {
  instance.parse();
  resetFields(req, instance);
  // Get suggestions.
  await getPostCodeSuggestions(req, instance);

  instance.store();
  instance.res.render(instance.template, instance.locals);
  return Promise.resolve(false);
};

const isManual = (req, instance) => {
  instance.postcodeLookupType = 'auto';

  if (req.query.type && req.query.type === 'auto') {
    req.session.postcodeLookupType = 'auto';
    resetDisabledFields();
    instance.parse();
    resetFields(req, instance, true);
    instance.store();
    return false;
  }

  if (req.session.postcodeLookupType === 'manual' ||
     (req.query.type && req.query.type === 'manual')) {
    req.session.postcodeLookupType = 'manual';
    instance.postcodeLookupType = 'manual';
    // resetFields(req, instance, true);
    manualFileds();
    instance.store();

    return true;
  }

  return false;
};

const postCodeLookup = (req, instance) => {
  // try to retrieve session field values
  instance.retrieve();

  if (isManual(req, instance)) {
    return Promise.resolve(true);
  }


  // try to retrive addressSuggestions.
  if (req.session.addressSuggestions) {
    instance.addressSuggestions = req.session.addressSuggestions;
  }

  if (req.body.submitType === 'lookup') {
    return addressLookup(req, instance);
  }

  if (req.body.submitType === 'addressSelection') {
    return fillAddressForm(req, instance);
  }

  return Promise.resolve(true);
};

module.exports = { postCodeLookup, postCodeForm, postcodeFieldNames };