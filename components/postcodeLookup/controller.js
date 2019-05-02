
const rp = require('request-promise');
const conf = require('config');
const { includes } = require('lodash');
const { form } = require('@hmcts/one-per-page/forms');

const postCodeLookupUrl = conf.postcodeLookup.url;
const postCodeLookupToken = conf.postcodeLookup.token;
const postCodeLookupEnabled = conf.postcodeLookup.enabled;
const { buildConcatenatedAddress } = require('./helper');
const postcodeLookupContent = require('./content.en.json');

const postCodeFieldMapper = {
  postcodeLookup: 'postCodeLookup',
  postcodeAddress: 'postcodeAddress',
  line1: 'addressLine1',
  line2: 'addressLine2',
  town: 'townCity',
  county: 'county',
  postCode: 'postCode'
};

let disabledFields = [];

const postCodeFormSchemaBuilder = fields => {
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
    postCodeFieldMapper.postcodeAddress,
    postCodeFieldMapper.line1,
    postCodeFieldMapper.line2,
    postCodeFieldMapper.town,
    postCodeFieldMapper.county,
    postCodeFieldMapper.postCode
  ];
};

const postcodeAddressFields = () => {
  disabledFields = [
    postCodeFieldMapper.line1,
    postCodeFieldMapper.line2,
    postCodeFieldMapper.town,
    postCodeFieldMapper.county,
    postCodeFieldMapper.postCode
  ];
};

const manualFileds = () => {
  disabledFields = [
    postCodeFieldMapper.postcodeLookup,
    postCodeFieldMapper.postcodeAddress
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
  if ((req.query.type && req.query.type === 'manual') || !postCodeLookupEnabled) {
    return 'manual';
  } else if ((req.query.type && req.query.type === 'auto') && postCodeLookupEnabled) {
    return 'auto';
  } else if (req.session.postcodeLookupType === 'auto' && postCodeLookupEnabled) {
    return 'auto';
  } else if (req.session.postcodeLookupType === 'manual') {
    return 'manual';
  } else if (postCodeLookupEnabled) {
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

    if (instance.fields[postCodeFieldMapper.postcodeLookup] &&
        instance.fields[postCodeFieldMapper.postcodeLookup].validate() &&
        instance.addressSuggestions.length > 0 &&
        instance.fields[postCodeFieldMapper.postcodeAddress] &&
        instance.fields[postCodeFieldMapper.postcodeAddress].validate()) {
      alldFields();
    } else if (instance.fields[postCodeFieldMapper.postcodeLookup] &&
               instance.fields[postCodeFieldMapper.postcodeLookup].validate() &&
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
  const postCode = instance.fields[postCodeFieldMapper.postcodeLookup].value;
  const options = {
    json: true,
    uri: `${postCodeLookupUrl}/addresses/postcode?postcode=${postCode}&key=${postCodeLookupToken}`,
    method: 'GET'
  };

  await rp(options).then(body => {
    if (body.results && body.results.length > 0) {
      instance.addressSuggestions = body.results;
      req.session.addressSuggestions = instance.addressSuggestions;
    } else {
      instance.fields[postCodeFieldMapper.postcodeLookup].value = '';
      instance.fields[postCodeFieldMapper.postcodeLookup].validate();
    }
    Promise.resolve();
  }).catch(() => {
    instance.fields[postCodeFieldMapper.postcodeLookup].validate();
    Promise.resolve();
  });

  instance.store();
  instance.res.redirect(`${instance.path}?validate=1`);
};

const handleAddressSelection = (req, instance) => {
  let selectedAddress = [];
  // eslint-disable-next-line max-len
  if (instance.fields[postCodeFieldMapper.postcodeAddress].validate() && instance.addressSuggestions) {
    const selectedUPRN = instance.fields[postCodeFieldMapper.postcodeAddress].value;
    if (selectedUPRN) {
      // eslint-disable-next-line max-len
      selectedAddress = instance.addressSuggestions.filter(address => address.DPA.UPRN === selectedUPRN);
    }
  }

  if (selectedAddress.length === 1) {
    const concatenated = buildConcatenatedAddress(selectedAddress[0]);
    setPageState(req, instance);
    instance.fields[postCodeFieldMapper.line1].value = concatenated.line1;
    instance.fields[postCodeFieldMapper.line2].value = concatenated.line2;
    instance.fields[postCodeFieldMapper.town].value = concatenated.town;
    instance.fields[postCodeFieldMapper.county].value = concatenated.county;
    instance.fields[postCodeFieldMapper.postCode].value = concatenated.postCode;
    instance.validate();
  }
  instance.store();
  instance.res.redirect(`${instance.path}?validate=1`);
};

const postCodeLookupController = (req, res, next, instance, superCallback) => {
  instance.postCodeContent = postcodeLookupContent;
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
  postCodeLookupController,
  postCodeFormSchemaBuilder,
  postCodeFieldMapper,
  postcodeLookupContent
};