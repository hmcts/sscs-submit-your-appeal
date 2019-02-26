const { goTo } = require('@hmcts/one-per-page');
const { form, text, object } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');
const { SaveToDraftStore } = require('middleware/draftPetitionStoreMiddleware');
const customJoi = require('utils/customJoiSchemas');
const {
  postCode,
  firstName,
  lastName,
  whitelist,
  title
} = require('utils/regex');
const {
  joiValidation,
  hasNameButNoTitleValidation,
  hasTitleButNoNameValidation
} = require('utils/validationUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const emailOptions = require('utils/emailOptions');
const userAnswer = require('utils/answer');

class RepresentativeDetails extends SaveToDraftStore {
  static get path() {
    return paths.representative.representativeDetails;
  }

  get CYAName() {
    const nameTitle = this.fields.name.title.value || '';
    const first = this.fields.name.first.value || '';
    const last = this.fields.name.last.value || '';
    return first === '' && last === '' ?
      userAnswer.NOT_PROVIDED :
      `${nameTitle} ${first} ${last}`.trim();
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

  get form() {
    const fields = this.content.fields;

    return form({

      name: object({
        title: text,
        first: text,
        last: text,
        organisation: text
      }).check(
        fields.name.error.required,
        value => Object.keys(value).length > 0
      ).check(
        fields.name.error.nameNoTitle,
        value => hasNameButNoTitleValidation(value)
      ).check(
        fields.name.error.titleNoName,
        value => hasTitleButNoNameValidation(value)
      ).check(
        errorFor('title', fields.name.title.error.invalid),
        value => joiValidation(value.title, Joi.string().trim().regex(title))
      ).check(
        errorFor('first', fields.name.first.error.invalid),
        value => joiValidation(value.first, Joi.string().trim().regex(firstName))
      ).check(
        errorFor('last', fields.name.last.error.invalid),
        value => joiValidation(value.last, Joi.string().trim().regex(lastName))
      ).check(
        errorFor('organisation', fields.name.organisation.error.invalid),
        value => joiValidation(value.organisation, Joi.string().regex(whitelist))
      ),
      addressLine1: text.joi(
        fields.addressLine1.error.required,
        Joi.string().regex(whitelist).required()
      ),
      addressLine2: text.joi(
        fields.addressLine2.error.invalid,
        Joi.string().regex(whitelist).allow('')
      ),
      townCity: text.joi(
        fields.townCity.error.required,
        Joi.string().regex(whitelist).required()
      ),
      county: text.joi(
        fields.county.error.required,
        Joi.string().regex(whitelist).required()
      ),
      postCode: text.joi(
        fields.postCode.error.required,
        Joi.string().trim().regex(postCode).required()
      ),
      emailAddress: text.joi(
        fields.emailAddress.error.invalid,
        Joi.string().trim().email(emailOptions).allow('')
      ),
      phoneNumber: text.joi(
        fields.phoneNumber.error.invalid,
        customJoi.string().trim().validatePhone()
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
    return {
      representative: {
        title: this.fields.name.title.value,
        firstName: this.fields.name.first.value,
        lastName: this.fields.name.last.value,
        organisation: this.fields.name.organisation.value,
        contactDetails: {
          addressLine1: this.fields.addressLine1.value,
          addressLine2: this.fields.addressLine2.value,
          townCity: this.fields.townCity.value,
          county: this.fields.county.value,
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
    return goTo(this.journey.steps.ReasonForAppealing);
  }
}

module.exports = RepresentativeDetails;
