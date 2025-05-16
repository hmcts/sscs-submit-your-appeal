/* eslint-disable max-lines */
const request = require('superagent');
const { includes } = require('lodash');
const { form } = require('@hmcts/one-per-page/forms');
const { buildConcatenatedAddress } = require('./helper');
const i18next = require('i18next');
const customFieldValidations = require('./customFieldValidations.js');
const { text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const { isIba } = require('utils/benefitTypeUtils');
const { notNiPostcode } = require('utils/regex');
const config = require('config');
class Controller {
  constructor(enabled = true, token = '', apiUrl = '', page = {}) {
    this.enabled = enabled;
    this.page = page;
    this.token = token;
    this.apiUrl = apiUrl;
    this.disabledFields = [];
    this.fieldMap = {
      postcodeLookup: 'postcodeLookup',
      postcodeAddress: 'postcodeAddress',
      line1: 'addressLine1',
      line2: 'addressLine2',
      town: 'townCity',
      county: 'county',
      postCode: 'postCode'
    };
    this.sessionName = `${page.name}.pcl`;
  }

  schemaBuilder(fields) {
    const sessionLanguage = i18next.language;
    const content = require(`./content.${sessionLanguage}`);

    if (this.isManualSession()) {
      this.manualFields();
    }
    const isIbaCase = isIba(this.page.req);

    const getPostcodeLookup = () => {
      if (isIbaCase) {
        const allowNI = config.get('features.allowNI.enabled');
        return text
          .joi(
            allowNI ?
               content.fields.postcodeLookup.error.requiredNI :
               content.fields.postcodeLookup.error.required, 
             allowNI ?
               Joi.string().trim().required() :
               Joi.string().trim().regex(notNiPostcode).required()
          )
          .joi(
            content.fields.postcodeAddress.error.required,
            customFieldValidations.string().validateAddressList(this.page)
          );
      }
      return text
        .joi(
          content.fields.postcodeLookup.error.required,
          Joi.string().trim().required()
        )
        .joi(
          content.fields.postcodeAddress.error.required,
          customFieldValidations.string().validateAddressList(this.page)
        );
    };

    const newForm = Object.create(null);
    for (let i = 0; i < fields.length; i++) {
      if (!includes(this.disabledFields, fields[i].name)) {
        if (fields[i].name === this.fieldMap.postcodeLookup) {
          newForm[fields[i].name] = getPostcodeLookup();
        } else if (fields[i].name === this.fieldMap.postcodeAddress) {
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
  }

  postcodeLookupFields() {
    const fieldMap = this.fieldMap;
    this.disabledFields = [
      fieldMap.postcodeAddress,
      fieldMap.line1,
      fieldMap.line2,
      fieldMap.town,
      fieldMap.county,
      fieldMap.postCode
    ];
    return this.disabledFields;
  }

  postcodeAddressFields() {
    const fieldMap = this.fieldMap;
    this.disabledFields = [
      fieldMap.line1,
      fieldMap.line2,
      fieldMap.town,
      fieldMap.county,
      fieldMap.postCode
    ];
    return this.disabledFields;
  }

  manualFields() {
    const fieldMap = this.fieldMap;
    this.disabledFields = [fieldMap.postcodeLookup, fieldMap.postcodeAddress];
    return this.disabledFields;
  }

  alldFields() {
    this.disabledFields = [];
    return this.disabledFields;
  }

  resetSuggestions() {
    this.page.addressSuggestions = [];
    if (this.page.fields[this.fieldMap.postcodeAddress]) {
      this.page.fields[this.fieldMap.postcodeAddress].value = '';
    }
    this.page.store();
  }

  isManualPost() {
    const req = this.page.req;
    return (
      req.method === 'POST' &&
      typeof req.body[this.fieldMap.postcodeLookup] === 'undefined'
    );
  }

  isManualSession() {
    const req = this.page.req;
    const page = this.page;
    return (
      (req.session[page.name] && req.session[page.name].type === 'manual') ||
      (req.session[this.sessionName] &&
        req.session[this.sessionName].type === 'manual')
    );
  }

  setMode(type = 'auto') {
    const session = this.page.req.session;
    const page = this.page;
    page.postcodeLookupType = type;
    session[this.sessionName] = { type };
    return type;
  }

  getFormType() {
    const req = this.page.req;
    if (!this.enabled || req.query.type === 'manual' || this.isManualPost()) {
      return this.setMode('manual');
    }

    if (this.enabled && req.query.type === 'auto') {
      return this.setMode('auto');
    }

    if (this.isManualSession()) {
      return this.setMode('manual');
    }

    return this.setMode('auto');
  }

  restoreValues() {
    const page = this.page;
    const req = this.page.req;
    if (req.method === 'POST') {
      page.parse();
      page.store();
    } else {
      page.retrieve();
    }
  }

  async handlePostCodeLookup() {
    const fieldMap = this.fieldMap;
    const page = this.page;
    const postCode = page.fields[fieldMap.postcodeLookup].value;

    try {
      const res = await request
        .get(`${this.apiUrl}/postcode`)
        .query({ key: this.token, postcode: postCode, lr: 'EN' });

      if (res.body.results && res.body.results.length > 0) {
        page.addressSuggestions = res.body.results;
      } else {
        page.fields[fieldMap.postcodeLookup].value = '';
      }
    } catch {
      page.fields[fieldMap.postcodeLookup].value = '';
    }

    page.store();
  }
  handleAddressSelection() {
    let selectedAddress = [];
    const page = this.page;
    const fieldMap = this.fieldMap;
    if (
      page.fields &&
      page.fields[fieldMap.postcodeAddress] &&
      page.fields[fieldMap.postcodeAddress].validate() &&
      page.addressSuggestions
    ) {
      const selectedUPRN = page.fields[fieldMap.postcodeAddress].value;
      if (selectedUPRN) {
        selectedAddress = page.addressSuggestions.filter(
          address => address.DPA.UPRN === selectedUPRN
        );
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
  }

  handleGetValidate() {
    const page = this.page;
    if (
      page.postcodeLookupType === 'manual' ||
      page.addressSuggestions.length === 0
    ) {
      this.page.validate();
    }
  }

  // eslint-disable-next-line complexity
  async setPageState() {
    const page = this.page;
    const fieldMap = this.fieldMap;
    this.restoreValues();
    // restore suggestions if they exits
    page.addressSuggestions = [];
    if (
      page.fields[fieldMap.postcodeLookup] &&
      page.fields[fieldMap.postcodeLookup].validate()
    ) {
      await this.handlePostCodeLookup();
    }
    const formType = this.getFormType();
    if (formType === 'auto') {
      if (
        page.fields[fieldMap.postcodeLookup] &&
        page.fields[fieldMap.postcodeLookup].validate() &&
        page.addressSuggestions.length > 0 &&
        page.fields[fieldMap.postcodeAddress] &&
        page.fields[fieldMap.postcodeAddress].validate()
      ) {
        this.alldFields();
      } else if (
        page.fields[fieldMap.postcodeLookup] &&
        page.fields[fieldMap.postcodeLookup].validate() &&
        page.addressSuggestions.length > 0
      ) {
        this.postcodeAddressFields();
      } else {
        this.postcodeLookupFields();
      }
    } else {
      this.manualFields();
    }
    this.restoreValues();
  }

  // eslint-disable-next-line complexity
  async init(callBack) {
    const sessionLanguage = i18next.language;

    const req = this.page.req;
    const content = require(
      `./content${isIba(req) ? 'Iba' : ''}.${sessionLanguage}`
    );

    const page = this.page;

    page.postCodeContent = content;

    await this.setPageState(page);
    if (req.body.submitType === 'lookup') {
      this.resetSuggestions();
      page.res.redirect(`${page.path}?validate=1`);
    } else if (req.body.submitType === 'addressSelection') {
      this.handleAddressSelection(page);
      page.res.redirect(`${page.path}?validate=1`);
    } else if (req.body.submitType === 'manual') {
      this.manualFields();
      page.res.redirect(`${page.path}?type=manual`);
    } else if (req.method === 'GET' && req.query.validate) {
      this.handleGetValidate(page);
      page.res.render(page.template, page.locals);
    } else if (req.method === 'GET' && req.query.type) {
      page.res.render(page.template, page.locals);
    } else if (this.isManualPost() && !page.validate().valid) {
      page.res.redirect(`${page.path}?type=manual&validate=1`);
    } else {
      if (typeof callBack !== 'function') {
        throw Error('Super Callback function is not defined');
      }
      callBack();
    }
  }
}

module.exports = Controller;
