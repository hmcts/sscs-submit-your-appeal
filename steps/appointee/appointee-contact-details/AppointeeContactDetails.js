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

const usePostcodeChecker = config.get('postcodeChecker.enabled');
const pcl = require('components/postcodeLookup/controller');
const { decode } = require('utils/stringUtils');

class AppointeeContactDetails extends SaveToDraftStore {
  static get path() {
    return paths.appointee.enterAppointeeContactDetails;
  }

  handler(req, res, next) {
    pcl.controller(this, () => super.handler(req, res, next));
  }

  get CYAPhoneNumber() {
    return this.fields.phoneNumber.value || userAnswer.NOT_PROVIDED;
  }

  get CYAEmailAddress() {
    return this.fields.emailAddress.value || userAnswer.NOT_PROVIDED;
  }

  get form() {
    const fields = this.content.fields;

    return pcl.schemaBuilder([
      { name: pcl.fieldMap.postcodeLookup },
      { name: pcl.fieldMap.postcodeAddress },
      { name: pcl.fieldMap.line1,
        validator: text.joi(
          fields.addressLine1.error.required,
          Joi.string().regex(whitelist).required()
        ) },
      { name: pcl.fieldMap.line2,
        validator: text.joi(
          fields.addressLine2.error.invalid,
          Joi.string().regex(whitelist).allow('')
        ) },
      { name: pcl.fieldMap.town,
        validator: text.joi(
          fields.townCity.error.required,
          Joi.string().regex(whitelist).required()
        ) },
      { name: pcl.fieldMap.county,
        validator: text.joi(
          fields.county.error.required,
          Joi.string().regex(whitelist).required()
        ) },
      { name: pcl.fieldMap.postCode,
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
    ], this);
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
      AppointeeContactDetails.saveSession
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
          postCodeLookup: this.fields[pcl.fieldMap.postcodeLookup] ?
            decode(this.fields[pcl.fieldMap.postcodeLookup].value) :
            '',
          postcodeAddress: this.fields[pcl.fieldMap.postcodeAddress] ?
            decode(this.fields[pcl.fieldMap.postcodeAddress].value) :
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
