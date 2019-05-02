
const rp = require('request-promise');
const conf = require('config');
const { includes } = require('lodash');
const { form } = require('@hmcts/one-per-page/forms');

const url = conf.postcodeLookup.url;
const token = conf.postcodeLookup.token;
const enabled = conf.postcodeLookup.enabled;
const { buildConcatenatedAddress } = require('./helper');
const content = require('./content.en.json');

const fieldMap = {
  postcodeLookup: 'postCodeLookup',
  postcodeAddress: 'postcodeAddress',
  line1: 'addressLine1',
  line2: 'addressLine2',
  town: 'townCity',
  county: 'county',
  postCode: 'postCode'
};

let disabledFields = [];

const schemaBuilder = fields => {
  const newForm = Object.create(null);
  for (let i = 0; i < fields.length; i++) {
    if (!includes(disabledFields, fields[i].name)) {
      newForm[fields[i].name] = fields[i].validator;
    }
  }
  return form(newForm);
};


const postcodeLookupFields = () => {
  disabledFields = [
    fieldMap.postcodeAddress,
    fieldMap.line1,
    fieldMap.line2,
    fieldMap.town,
    fieldMap.county,
    fieldMap.postCode
  ];
};

const postcodeAddressFields = () => {
  disabledFields = [
    fieldMap.line1,
    fieldMap.line2,
    fieldMap.town,
    fieldMap.county,
    fieldMap.postCode
  ];
};

const manualFileds = () => {
  disabledFields = [
    fieldMap.postcodeLookup,
    fieldMap.postcodeAddress
  ];
};

const alldFields = () => {
  disabledFields = [];
};

const resetSuggestions = (req, instance) => {
  instance.addressSuggestions = [];
  req.session.addressSuggestions = [];
};

// eslint-disable-next-line complexity
const getFormType = req => {
  if ((req.query.type && req.query.type === 'manual') || !enabled) {
    return 'manual';
  } else if ((req.query.type && req.query.type === 'auto') && enabled) {
    return 'auto';
  } else if (req.session.postcodeLookupType === 'auto' && enabled) {
    return 'auto';
  } else if (req.session.postcodeLookupType === 'manual') {
    return 'manual';
  } else if (enabled) {
    return 'auto';
  }
  return 'manual';
};

const restoreValues = (instance, req) => {
  if (req.method === 'POST') {
    instance.parse();
  } else {
    instance.retrieve();
  }
};

// eslint-disable-next-line complexity
const setPageState = (req, instance) => {
  restoreValues(instance, req);
  // restore suggestions if they exits
  instance.addressSuggestions = [];
  if (req.body.submitType !== 'lookup' && req.session.addressSuggestions) {
    instance.addressSuggestions = req.session.addressSuggestions;
  }
  const formType = getFormType(req);
  if (formType === 'auto') {
    req.session.postcodeLookupType = 'auto';
    instance.postcodeLookupType = 'auto';

    if (instance.fields[fieldMap.postcodeLookup] &&
        instance.fields[fieldMap.postcodeLookup].validate() &&
        instance.addressSuggestions.length > 0 &&
        instance.fields[fieldMap.postcodeAddress] &&
        instance.fields[fieldMap.postcodeAddress].validate()) {
      alldFields();
    } else if (instance.fields[fieldMap.postcodeLookup] &&
               instance.fields[fieldMap.postcodeLookup].validate() &&
               instance.addressSuggestions.length > 0) {
      postcodeAddressFields();
    } else {
      postcodeLookupFields();
      resetSuggestions(req, instance);
    }
  } else {
    req.session.postcodeLookupType = 'manual';
    instance.postcodeLookupType = 'manual';
    manualFileds();
  }
  restoreValues(instance, req);
};

const handlePostCodeLookup = async(req, instance) => {
  const postCode = instance.fields[fieldMap.postcodeLookup].value;
  const options = {
    json: true,
    uri: `${url}/addresses/postcode?postcode=${postCode}&key=${token}`,
    method: 'GET'
  };

  await rp(options).then(body => {
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

  instance.store();
  instance.res.redirect(`${instance.path}?validate=1`);
};

const handleAddressSelection = (req, instance) => {
  let selectedAddress = [];
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
    setPageState(req, instance);
    instance.fields[fieldMap.line1].value = concatenated.line1;
    instance.fields[fieldMap.line2].value = concatenated.line2;
    instance.fields[fieldMap.town].value = concatenated.town;
    instance.fields[fieldMap.county].value = concatenated.county;
    instance.fields[fieldMap.postCode].value = concatenated.postCode;
    instance.validate();
  }
  instance.store();
  instance.res.redirect(`${instance.path}?validate=1`);
};

const controller = (req, res, next, instance, superCallback) => {
  instance.postCodeContent = content;
  setPageState(req, instance);

  if (req.body.submitType === 'lookup') {
    handlePostCodeLookup(req, instance);
  } else if (req.body.submitType === 'addressSelection') {
    handleAddressSelection(req, instance);
  } else if (req.method === 'GET' && req.query.validate) {
    if (instance.addressSuggestions.length === 0) instance.validate();
    instance.res.render(instance.template, instance.locals);
  } else {
    superCallback.call(instance, req, res, next);
  }
};

module.exports = {
  controller,
  schemaBuilder,
  fieldMap,
  content
};