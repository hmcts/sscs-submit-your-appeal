const { goTo } = require('@hmcts/one-per-page');
const { text, form } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const emailOptions = require('utils/emailOptions');
const userAnswer = require('utils/answer');
const customJoi = require('utils/customJoiSchemas');
const { decode } = require('utils/stringUtils');
const countriesList = require('utils/countriesList');

class AppointeeInternationalContactDetails extends SaveToDraftStore {
  static get path() {
    return paths.appointee.enterAppointeeInternationalContactDetails;
  }

  get CYAPhoneNumber() {
    return this.fields.phoneNumber?.value || userAnswer.NOT_PROVIDED;
  }

  get CYAEmailAddress() {
    return this.fields.emailAddress?.value || userAnswer.NOT_PROVIDED;
  }

  validCountrySchema() {
    const validCountries = countriesList.map(country => country.value);
    return Joi.string().valid(validCountries);
  }

  get form() {
    const fields = this.content.fields;
    return form({
      country: text.joi(
        fields.country.error.required,
        Joi.string().required()
      ).joi(
        fields.country.error.invalid,
        this.validCountrySchema()
      ),
      internationalAddress: text.joi(
        fields.internationalAddress.error.required,
        Joi.string().required()
      ),
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
    return countriesList;
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
          country: decode(this.fields.country.value),
          internationalAddress: decode(this.fields.internationalAddress.value),
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

module.exports = AppointeeInternationalContactDetails;
