const rp = require('request-promise');
const conf = require('config');
const { includes } = require('lodash');
const { form } = require('@hmcts/one-per-page/forms');

const url = conf.postcodeLookup.url;
const token = conf.postcodeLookup.token;
const enabled = conf.postcodeLookup.enabled === 'true';
const { buildConcatenatedAddress } = require('./helper');
const content = require('./content.en.json');
const customFieldValidations = require('./customFieldValidations.js');
const { text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');

const fieldMap = {
  postcodeLookup: 'postcodeLookup',
  postcodeAddress: 'postcodeAddress',
  line1: 'addressLine1',
  line2: 'addressLine2',
  town: 'townCity',
  county: 'county',
  postCode: 'postCode'
};

let disabledFields = [];

const schemaBuilder = (fields, page) => {
  const newForm = Object.create(null);
  for (let i = 0; i < fields.length; i++) {
    if (!includes(disabledFields, fields[i].name)) {
      if (fields[i].name === fieldMap.postcodeLookup) {
        newForm[fields[i].name] = text.joi(
          content.fields.postcodeLookup.error.required,
          Joi.string().trim().required()
        ).joi(
          content.fields.postcodeAddress.error.required,
          customFieldValidations.string().validateAddressList(page)
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

const resetSuggestions = page => {
  page.addressSuggestions = [];
};

// eslint-disable-next-line max-len
const isManualPost = page => page.req.method === 'POST' && typeof page.req.body[fieldMap.postcodeLookup] === 'undefined';
// eslint-disable-next-line max-len
const isManualParameter = page => page.req.query.type === 'manual' || (page.fields.type && page.fields.type.value === 'manual');

const getFormType = page => {
  if (isManualParameter(page) || !enabled || isManualPost(page)) {
    page.postcodeLookupType = 'manual';
    return 'manual';
  }
  page.postcodeLookupType = 'auto';
  return 'auto';
};

const restoreValues = page => {
  if (page.req.method === 'POST') {
    page.parse();
    page.store();
  } else {
    page.retrieve();
  }
};

const handlePostCodeLookup = async page => {
  const postCode = page.fields[fieldMap.postcodeLookup].value;
  const options = {
    json: true,
    uri: `${url}/addresses/postcode?postcode=${postCode}&key=${token}`,
    method: 'GET'
  };

  await rp(options).then(body => {
    if (body.results && body.results.length > 0) {
      page.addressSuggestions = body.results;
    } else {
      page.fields[fieldMap.postcodeLookup].value = '';
    }
    Promise.resolve();
  }).catch(() => {
    page.fields[fieldMap.postcodeLookup].value = '';
    Promise.resolve();
  });

  page.store();
};

const handleAddressSelection = page => {
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
    page.fields[fieldMap.line1].value = concatenated.line1;
    page.fields[fieldMap.line2].value = concatenated.line2;
    page.fields[fieldMap.town].value = concatenated.town;
    page.fields[fieldMap.county].value = concatenated.county;
    page.fields[fieldMap.postCode].value = concatenated.postCode;
    page.validate();
  }
  page.store();
};

const handleGetValidate = page => {
  if (page.postcodeLookupType === 'manaul' || page.addressSuggestions.length === 0) page.validate();
};

// eslint-disable-next-line complexity
const setPageState = async page => {
  restoreValues(page);
  // restore suggestions if they exits
  page.addressSuggestions = [];
  if (page.fields[fieldMap.postcodeLookup] && page.fields[fieldMap.postcodeLookup].validate()) {
    await handlePostCodeLookup(page);
  }
  const formType = getFormType(page);
  if (formType === 'auto') {
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
      resetSuggestions(page);
    }
  } else {
    manualFileds();
  }
  restoreValues(page);
};

// eslint-disable-next-line complexity
const controller = async(page, callBack) => {
  const req = page.req;
  page.postCodeContent = content;
  await setPageState(page);

  if (req.body.submitType === 'lookup') {
    await handlePostCodeLookup(page);
    page.res.redirect(`${page.path}?validate=1`);
  } else if (req.body.submitType === 'addressSelection') {
    handleAddressSelection(page);
    page.res.redirect(`${page.path}?validate=1`);
  } else if (req.body.submitType === 'manual') {
    manualFileds();
    page.res.redirect(`${page.path}?type=manual`);
  } else if (req.method === 'GET' && req.query.validate) {
    handleGetValidate(page);
    page.res.render(page.template, page.locals);
  } else if (req.method === 'GET' && req.query.type) {
    page.res.render(page.template, page.locals);
  } else if (isManualPost(page) && !page.validate().valid) {
    page.res.redirect(`${page.path}?type=manual&validate=1`);
  } else {
    if (typeof callBack !== 'function') {
      throw Error('Super Callback function is not defined');
    }
    callBack();
  }
};

module.exports = {
  controller,
  schemaBuilder,
  fieldMap
};