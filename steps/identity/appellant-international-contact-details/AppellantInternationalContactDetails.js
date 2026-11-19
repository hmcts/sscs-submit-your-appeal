const { goTo } = require('lib/vendor/one-per-page');
const { text, form } = require('lib/vendor/one-per-page/forms');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const emailOptions = require('utils/emailOptions');
const userAnswer = require('utils/answer');
const customJoi = require('utils/customJoiSchemas');
const { decode } = require('utils/stringUtils');
const { whitelistNotFirst } = require('utils/regex');
const { isIba } = require('utils/benefitTypeUtils');
const { getPortsOfEntry } = require('utils/enumJsonLists');
const { getCountriesOfResidence } = require('../../../utils/enumJsonLists');

class AppellantInternationalContactDetails extends SaveToDraftStore {
  static get path() {
    return paths.identity.enterAppellantInternationalContactDetails;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && !isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  get CYAPhoneNumber() {
    return this.fields.phoneNumber?.value || userAnswer.NOT_PROVIDED;
  }

  get CYAEmailAddress() {
    return this.fields.emailAddress?.value || userAnswer.NOT_PROVIDED;
  }

  validCountrySchema() {
    const validCountries = getCountriesOfResidence().map(
      country => country.value
    );
    return Joi.string().valid(...validCountries);
  }

  validPortSchema() {
    const validPorts = getPortsOfEntry().map(port => port.value);
    return Joi.string().valid(...validPorts);
  }

  get form() {
    const fields = this.content.fields;
    return form({
      addressLine1: text
        .joi(fields.addressLine1.error.required, Joi.string().required())
        .joi(
          fields.addressLine1.error.invalid,
          Joi.string().regex(whitelistNotFirst)
        ),
      addressLine2: text.joi(
        fields.addressLine2.error.invalid,
        Joi.string().regex(whitelistNotFirst)
      ),
      townCity: text
        .joi(fields.townCity.error.required, Joi.string().required())
        .joi(
          fields.townCity.error.invalid,
          Joi.string().regex(whitelistNotFirst)
        ),
      postCode: text.joi(
        fields.postCode.error.invalid,
        Joi.string().regex(whitelistNotFirst)
      ),
      country: text
        .joi(fields.country.error.required, Joi.string().required())
        .joi(fields.country.error.invalid, this.validCountrySchema()),
      portOfEntry: text
        .joi(fields.portOfEntry.error.required, Joi.string().required())
        .joi(fields.portOfEntry.error.invalid, this.validPortSchema()),
      phoneNumber: text.joi(
        fields.phoneNumber.error.invalid,
        customJoi.string().trim().validatePhone()
      ),
      emailAddress: text.joi(
        fields.emailAddress.error.invalid,
        Joi.string().trim().email(emailOptions).allow('')
      )
    });
  }

  get getCountries() {
    return getCountriesOfResidence();
  }

  get getPortOfEntryList() {
    return getPortsOfEntry();
  }

  get getPortOfEntryFromCode() {
    return getPortsOfEntry()
      .filter(port => port.value === this.fields.portOfEntry.value)
      .map(port => port.label)[0];
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
          postCode: this.fields.postCode.value ?
            this.fields.postCode.value.trim() :
            this.fields.postCode.value,
          country: decode(this.fields.country.value),
          portOfEntry: decode(this.fields.portOfEntry.value),
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

module.exports = AppellantInternationalContactDetails;
