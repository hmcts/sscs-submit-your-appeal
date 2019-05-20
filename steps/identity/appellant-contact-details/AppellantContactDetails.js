// const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { goTo } = require('@hmcts/one-per-page');
const { text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { get } = require('lodash');
const { postCode, whitelist } = require('utils/regex');
const logger = require('logger');

const logPath = 'AppellantContactDetails.js';
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const emailOptions = require('utils/emailOptions');
const userAnswer = require('utils/answer');
const customJoi = require('utils/customJoiSchemas');
const postcodeChecker = require('utils/postcodeChecker');
const config = require('config');
const { decode } = require('utils/stringUtils');

const usePostcodeChecker = config.get('postcodeChecker.enabled');
const pcl = require('components/postcodeLookup/controller');

class AppellantContactDetails extends SaveToDraftStore {
  static get path() {
    return paths.identity.enterAppellantContactDetails;
  }

  handler(req, res, next) {
    pcl.controller(req, res, next, this, super.handler);
  }

  isAppointee() {
    return get(this, 'journey.req.session.Appointee.isAppointee') === 'yes';
  }

  contentPrefix() {
    return this.isAppointee() ? 'withAppointee' : 'withoutAppointee';
  }

  get isAppointeeJourney() {
    return this.isAppointee();
  }

  get title() {
    return this.content.title[this.contentPrefix()];
  }

  get subtitle() {
    return this.content.subtitle[this.contentPrefix()];
  }

  get CYAPhoneNumber() {
    return this.fields.phoneNumber.value || userAnswer.NOT_PROVIDED;
  }

  get CYAEmailAddress() {
    return this.fields.emailAddress.value || userAnswer.NOT_PROVIDED;
  }

  get form() {
    const fields = this.content.fields;
    const prefix = this.contentPrefix();

    return pcl.schemaBuilder([
      { name: pcl.fieldMap.postcodeLookup },
      { name: pcl.fieldMap.postcodeAddress },
      { name: pcl.fieldMap.line1,
        validator: text.joi(
          fields.addressLine1.error[prefix].required,
          Joi.string().regex(whitelist).required()
        ) },
      { name: pcl.fieldMap.line2,
        validator: text.joi(
          fields.addressLine2.error[prefix].invalid,
          Joi.string().regex(whitelist).allow('')
        ) },
      { name: pcl.fieldMap.town,
        validator: text.joi(
          fields.townCity.error[prefix].required,
          Joi.string().regex(whitelist).required()
        ) },
      { name: pcl.fieldMap.county,
        validator: text.joi(
          fields.county.error[prefix].required,
          Joi.string().regex(whitelist).required()
        ) },
      { name: pcl.fieldMap.postCode,
        validator: text.joi(
          fields.postCode.error[prefix].required,
          Joi.string().trim().regex(postCode).required()
        ).joi(
          fields.postCode.error[prefix].invalidPostcode,
          customJoi.string().trim().validatePostcode(this.req.session.invalidPostcode)
        ) },
      { name: 'phoneNumber',
        validator: text.joi(
          fields.phoneNumber.error[prefix].invalid,
          customJoi.string().trim().validatePhone()
        ) },
      { name: 'emailAddress',
        validator: text.joi(
          fields.emailAddress.error[prefix].invalid,
          Joi.string().trim().email(emailOptions).allow('')
        ) }
    ], this.req);
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
      AppellantContactDetails.isEnglandOrWalesPostcode,
      AppellantContactDetails.saveSession
    ];
  }

  answers() {
    return [
      answer(this, {
        section: sections.appellantDetails,
        template: 'answer.html'
      })
    ];
  }

  values() {
    return {
      appellant: {
        contactDetails: {
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
    return goTo(this.journey.steps.TextReminders);
  }
}

module.exports = AppellantContactDetails;
