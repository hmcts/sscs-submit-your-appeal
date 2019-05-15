
const rp = require('request-promise');
const conf = require('config');
const { includes } = require('lodash');
const { form } = require('@hmcts/one-per-page/forms');

const url = conf.postcodeLookup.url;
const token = conf.postcodeLookup.token;
const enabled = conf.postcodeLookup.enabled;
const { buildConcatenatedAddress } = require('./helper');
const content = require('./content.en.json');
const customFieldValidations = require('./customFieldValidations.js');
const { text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');

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

const schemaBuilder = (fields, req) => {
  const newForm = Object.create(null);
  for (let i = 0; i < fields.length; i++) {
    if (!includes(disabledFields, fields[i].name)) {
      if (fields[i].name === fieldMap.postcodeLookup) {
        newForm[fields[i].name] = text.joi(
          content.fields.postCodeLookup.error.required,
          Joi.string().trim().required()
        ).joi(
          content.fields.postcodeAddress.error.required,
          customFieldValidations.string().validateAddressList(req)
        );
      } else if (fields[i].name === fieldMap.postcodeAddress) {
        newForm[fields[i].name] = text.joi(
          content.fields.postcodeAddress.error.required,
          Joi.string().required()
        );
      } else {
        newForm[fields[i].name] = fields[i].validator;
      }
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

const resetSuggestions = (req, page) => {
  page.addressSuggestions = [];
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

const restoreValues = (page, req) => {
  if (req.method === 'POST') {
    page.parse();
  } else {
    page.retrieve();
  }
};

// eslint-disable-next-line complexity
const setPageState = (req, page) => {
  restoreValues(page, req);
  // restore suggestions if they exits
  page.addressSuggestions = [];
  if (req.body.submitType !== 'lookup' && req.session.addressSuggestions) {
    page.addressSuggestions = req.session.addressSuggestions;
  }
  const formType = getFormType(req);
  if (formType === 'auto') {
    req.session.postcodeLookupType = 'auto';
    page.postcodeLookupType = 'auto';

    if (page.fields[fieldMap.postcodeLookup] &&
        page.fields[fieldMap.postcodeLookup].validate() &&
        page.addressSuggestions.length > 0 &&
        page.fields[fieldMap.postcodeAddress] &&
        page.fields[fieldMap.postcodeAddress].validate()) {
      alldFields();
    } else if (page.fields[fieldMap.postcodeLookup] &&
               page.fields[fieldMap.postcodeLookup].validate() &&
               page.addressSuggestions.length > 0) {
      postcodeAddressFields();
    } else {
      postcodeLookupFields();
      resetSuggestions(req, page);
    }
  } else {
    req.session.postcodeLookupType = 'manual';
    page.postcodeLookupType = 'manual';
  }
  restoreValues(page, req);
};

const handlePostCodeLookup = async(req, page) => {
  const postCode = page.fields[fieldMap.postcodeLookup].value;
  const options = {
    json: true,
    uri: `${url}/addresses/postcode?postcode=${postCode}&key=${token}`,
    method: 'GET'
  };

  await rp(options).then(body => {
    if (body.results && body.results.length > 0) {
      page.addressSuggestions = body.results;
      req.session.addressSuggestions = page.addressSuggestions;
    } else {
      page.fields[fieldMap.postcodeLookup].value = '';
    }
    Promise.resolve();
  }).catch(() => {
    page.fields[fieldMap.postcodeLookup].value = '';
    Promise.resolve();
  });

  page.store();
  page.res.redirect(`${page.path}?validate=1`);
};

const handleAddressSelection = (req, page) => {
  let selectedAddress = [];
  // eslint-disable-next-line max-len
  if (page.fields[fieldMap.postcodeAddress].validate() && page.addressSuggestions) {
    const selectedUPRN = page.fields[fieldMap.postcodeAddress].value;
    if (selectedUPRN) {
      // eslint-disable-next-line max-len
      selectedAddress = page.addressSuggestions.filter(address => address.DPA.UPRN === selectedUPRN);
    }
  }

  if (selectedAddress.length === 1) {
    const concatenated = buildConcatenatedAddress(selectedAddress[0]);
    setPageState(req, page);
    page.fields[fieldMap.line1].value = concatenated.line1;
    page.fields[fieldMap.line2].value = concatenated.line2;
    page.fields[fieldMap.town].value = concatenated.town;
    page.fields[fieldMap.county].value = concatenated.county;
    page.fields[fieldMap.postCode].value = concatenated.postCode;
    page.validate();
  }
  page.store();
  page.res.redirect(`${page.path}?validate=1`);
};

// eslint-disable-next-line complexity
const controller = (req, res, next, page, superCallback) => {
  page.postCodeContent = content;
  setPageState(req, page);

  if (req.body.submitType === 'lookup') {
    handlePostCodeLookup(req, page);
  } else if (req.body.submitType === 'addressSelection') {
    handleAddressSelection(req, page);
  } else if (req.body.submitType === 'manual') {
    manualFileds();
    page.parse();
    page.store();
    res.redirect(`${page.path}?type=manual`);
  } else if (req.method === 'GET' && req.query.validate) {
    if (page.addressSuggestions.length === 0) page.validate();
    page.res.render(page.template, page.locals);
  } else if (req.method === 'GET' && req.query.type) {
    page.res.render(page.template, page.locals);
  } else {
    superCallback.call(page, req, res, next);
  }
};

module.exports = {
  controller,
  schemaBuilder,
  fieldMap
};