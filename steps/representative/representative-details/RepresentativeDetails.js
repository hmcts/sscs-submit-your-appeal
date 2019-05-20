const { goTo } = require('@hmcts/one-per-page');
const { text, object } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const customJoi = require('utils/customJoiSchemas');
const pcl = require('components/postcodeLookup/controller');

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
const { decode } = require('utils/stringUtils');

class RepresentativeDetails extends SaveToDraftStore {
  static get path() {
    return paths.representative.representativeDetails;
  }

  handler(req, res, next) {
    pcl.controller(req, res, next, this, super.handler);
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

    return pcl.schemaBuilder([
      {
        name: 'name',
        validator: object({
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
        )
      },
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
    ], this.req);
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
        title: decode(this.fields.name.title.value),
        firstName: decode(this.fields.name.first.value),
        lastName: decode(this.fields.name.last.value),
        organisation: decode(this.fields.name.organisation.value),
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
    return goTo(this.journey.steps.ReasonForAppealing);
  }
}

module.exports = RepresentativeDetails;
