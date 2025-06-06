const { goTo } = require('@hmcts/one-per-page');
const { text, object, form } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const customJoi = require('utils/customJoiSchemas');
const { firstName, lastName, whitelist } = require('utils/regex');
const { joiValidation } = require('utils/validationUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const emailOptions = require('utils/emailOptions');
const userAnswer = require('utils/answer');
const { decode } = require('utils/stringUtils');
const { whitelistNotFirst } = require('utils/regex');
const { isIba } = require('utils/benefitTypeUtils');
const { getCountriesOfResidence } = require('utils/enumJsonLists');

class RepresentativeInternationalDetails extends SaveToDraftStore {
  static get path() {
    return paths.representative.representativeInternationalDetails;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && !isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  get CYAName() {
    const first = this.fields.name.first.value || '';
    const last = this.fields.name.last.value || '';
    return first === '' && last === '' ?
      userAnswer.NOT_PROVIDED :
      `${first} ${last}`.trim();
  }

  get CYAOrganisation() {
    return this.fields.name.organisation.value || userAnswer.NOT_PROVIDED;
  }

  get CYAPhoneNumber() {
    return this.fields.phoneNumber.value || userAnswer.NOT_PROVIDED;
  }

  get CYAEmailAddress() {
    return this.fields.emailAddress.value || userAnswer.NOT_PROVIDED;
  }

  validCountrySchema() {
    const validCountries = getCountriesOfResidence().map(
      country => country.value
    );
    return Joi.string().valid(validCountries);
  }

  get getCountries() {
    return getCountriesOfResidence();
  }

  get form() {
    const fields = this.content.fields;

    return form({
      name: object({
        first: text,
        last: text,
        organisation: text
      })
        .check(
          fields.name.error.required,
          value => Object.keys(value).length > 0
        )
        .check(errorFor('first', fields.name.first.error.invalid), value =>
          joiValidation(value.first, Joi.string().trim().regex(firstName))
        )
        .check(errorFor('last', fields.name.last.error.invalid), value =>
          joiValidation(value.last, Joi.string().trim().regex(lastName))
        )
        .check(
          errorFor('organisation', fields.name.organisation.error.invalid),
          value =>
            joiValidation(value.organisation, Joi.string().regex(whitelist))
        ),
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

  answers() {
    return [
      answer(this, {
        section: sections.representative,
        template: 'answer.html'
      })
    ];
  }

  values() {
    const first = this.fields.name.first.value;
    const last = this.fields.name.last.value;
    return {
      representative: {
        title: '',
        firstName: decode(first),
        lastName: decode(last),
        organisation: decode(this.fields.name.organisation.value),
        contactDetails: {
          addressLine1: decode(this.fields.addressLine1.value),
          addressLine2: decode(this.fields.addressLine2.value),
          townCity: decode(this.fields.townCity.value),
          postCode: this.fields.postCode.value ?
            this.fields.postCode.value.trim() :
            this.fields.postCode.value,
          country: decode(this.fields.country.value),
          phoneNumber: this.fields.phoneNumber.value ?
            this.fields.phoneNumber.value.trim() :
            this.fields.phoneNumber.value,
          emailAddress: this.fields.emailAddress.value
        }
      }
    };
  }

  next() {
    return goTo(this.journey.steps.ReasonForAppealing);
  }
}

module.exports = RepresentativeInternationalDetails;
