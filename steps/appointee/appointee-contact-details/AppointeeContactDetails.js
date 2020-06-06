const { goTo } = require('@hmcts/one-per-page');
const { text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { postCode, whitelist } = require('utils/regex');
const logger = require('logger');

const logPath = 'AppointeeContactDetails.js';
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const emailOptions = require('utils/emailOptions');
const userAnswer = require('utils/answer');
const postcodeChecker = require('utils/postcodeChecker');
const config = require('config');
const customJoi = require('utils/customJoiSchemas');
const checkWelshToggle = require('middleware/checkWelshToggle');

const usePostcodeChecker = config.get('postcodeChecker.enabled');

const { decode } = require('utils/stringUtils');

const PCL = require('components/postcodeLookup/controller');

const url = config.postcodeLookup.url;
const token = config.postcodeLookup.token;
const enabled = config.postcodeLookup.enabled === 'true';

class AppointeeContactDetails extends SaveToDraftStore {
  constructor(...args) {
    super(...args);
    this.pcl = new PCL(enabled, token, url, this);
  }
  static get path() {
    return paths.appointee.enterAppointeeContactDetails;
  }

  async handler(req, res, next) {
    await this.pcl.init(() => super.handler(req, res, next));
  }

  get CYAPhoneNumber() {
    return this.fields.phoneNumber.value || userAnswer.NOT_PROVIDED;
  }

  get CYAEmailAddress() {
    return this.fields.emailAddress.value || userAnswer.NOT_PROVIDED;
  }

  get form() {
    const fields = this.content.fields;

    return this.pcl.schemaBuilder([
      { name: this.pcl.fieldMap.postcodeLookup },
      { name: this.pcl.fieldMap.postcodeAddress },
      { name: this.pcl.fieldMap.line1,
        validator: text.joi(
          fields.addressLine1.error.required,
          Joi.string().regex(whitelist).required()
        ) },
      { name: this.pcl.fieldMap.line2,
        validator: text.joi(
          fields.addressLine2.error.invalid,
          Joi.string().regex(whitelist).allow('')
        ) },
      { name: this.pcl.fieldMap.town,
        validator: text.joi(
          fields.townCity.error.required,
          Joi.string().regex(whitelist).required()
        ) },
      { name: this.pcl.fieldMap.county,
        validator: text.joi(
          fields.county.error.required,
          Joi.string().regex(whitelist).required()
        ) },
      { name: this.pcl.fieldMap.postCode,
        validator: text.joi(
          fields.postCode.error.required,
          Joi.string().trim().regex(postCode).required()
        ).joi(
          fields.postCode.error.invalidPostcode,
          customJoi.string().trim().validatePostcode(this.req.session.invalidPostcode)
        ) },
      { name: 'phoneNumber',
        validator: text.joi(
          fields.phoneNumber.error.invalid,
          customJoi.string().trim().validatePhone()
        ) },
      { name: 'emailAddress',
        validator: text.joi(
          fields.emailAddress.error.invalid,
          Joi.string().trim().email(emailOptions).allow('')
        ) }
    ]);
  }

  static isEnglandOrWalesPostcode(req, resp, next) {
    if (!usePostcodeChecker) {
      req.session.invalidPostcode = false;
      next();
    } else if (req.method.toLowerCase() === 'post') {
      const postcode = req.body.postCode || '';

      postcodeChecker(postcode, true).then(isEnglandOrWalesPostcode => {
        req.session.invalidPostcode = !isEnglandOrWalesPostcode;
        next();
      }).catch(error => {
        logger.exception(error, logPath);
        req.session.invalidPostcode = true;
        next(error);
      });
    } else {
      next();
    }
  }

  static saveSession(req, resp, next) {
    req.session.save();
    next();
  }

  get middleware() {
    return [
      ...super.middleware,
      AppointeeContactDetails.isEnglandOrWalesPostcode,
      AppointeeContactDetails.saveSession,
      checkWelshToggle
    ];
  }

  answers() {
    return [
      answer(this, {
        section: sections.appointeeDetails,
        template: 'answer.html'
      })
    ];
  }

  values() {
    return {
      appointee: {
        contactDetails: {
          postcodeLookup: this.fields[this.pcl.fieldMap.postcodeLookup] ?
            decode(this.fields[this.pcl.fieldMap.postcodeLookup].value) :
            '',
          postcodeAddress: this.fields[this.pcl.fieldMap.postcodeAddress] ?
            decode(this.fields[this.pcl.fieldMap.postcodeAddress].value) :
            '',
          addressLine1: decode(this.fields.addressLine1.value),
          addressLine2: decode(this.fields.addressLine2.value),
          townCity: decode(this.fields.townCity.value),
          county: decode(this.fields.county.value),
          postCode: this.fields.postCode.value.trim(),
          phoneNumber: this.fields.phoneNumber.value ?
            this.fields.phoneNumber.value.trim() :
            this.fields.phoneNumber.value,
          emailAddress: this.fields.emailAddress.value
        }
      }
    };
  }

  next() {
    return goTo(this.journey.steps.AppellantName);
  }
}

module.exports = AppointeeContactDetails;
