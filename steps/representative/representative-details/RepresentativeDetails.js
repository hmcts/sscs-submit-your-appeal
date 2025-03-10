const { goTo } = require('@hmcts/one-per-page');
const { text, object } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const customJoi = require('utils/customJoiSchemas');
const {
  postCode,
  firstName,
  lastName,
  whitelist,
  whitelistNotFirst,
  title,
  notNiPostcode
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
const PCL = require('components/postcodeLookup/controller');
const config = require('config');
const { isIba } = require('utils/benefitTypeUtils');
const i18next = require('i18next');

const url = config.postcodeLookup.url;
const token = config.postcodeLookup.token;
const enabled = config.postcodeLookup.enabled === 'true';

class RepresentativeDetails extends SaveToDraftStore {
  constructor(...args) {
    super(...args);
    this.pcl = new PCL(enabled, token, url, this);
  }

  static get path() {
    return paths.representative.representativeDetails;
  }

  async handler(req, res, next) {
    await this.pcl.init(() => super.handler(req, res, next));
  }

  get CYAName() {
    const repTitle = this.fields.name.title.value || '';
    const first = this.fields.name.first.value || '';
    const last = this.fields.name.last.value || '';
    return first === '' && last === '' ?
      userAnswer[i18next.language].NOT_PROVIDED :
      `${repTitle} ${first} ${last}`.trim();
  }

  get CYAOrganisation() {
    return (
      this.fields.name.organisation.value ||
      userAnswer[i18next.language].NOT_PROVIDED
    );
  }

  get CYAPhoneNumber() {
    return (
      this.fields.phoneNumber.value || userAnswer[i18next.language].NOT_PROVIDED
    );
  }

  get CYAEmailAddress() {
    return (
      this.fields.emailAddress.value ||
      userAnswer[i18next.language].NOT_PROVIDED
    );
  }

  nameRequiredValidation(value) {
    return Object.keys(value).length > 0;
  }
  nameNoTitleValidation(value, req) {
    return isIba(req) || hasNameButNoTitleValidation(value);
  }
  titleNoNameValidation(value) {
    return hasTitleButNoNameValidation(value);
  }
  titleValidation(value, req) {
    return (
      isIba(req) || joiValidation(value.title, Joi.string().trim().regex(title))
    );
  }
  firstValidation(value) {
    return joiValidation(value.first, Joi.string().trim().regex(firstName));
  }
  lastValidation(value) {
    return joiValidation(value.last, Joi.string().trim().regex(lastName));
  }
  orgValidation(value) {
    return joiValidation(value.organisation, Joi.string().regex(whitelist));
  }

  get form() {
    const fields = this.content.fields;

    return this.pcl.schemaBuilder([
      {
        name: 'name',
        validator: object({
          title: text,
          first: text,
          last: text,
          organisation: text
        })
          .check(fields.name.error.required, this.nameRequiredValidation)
          .check(fields.name.error.nameNoTitle, value =>
            this.nameNoTitleValidation(value, this.req)
          )
          .check(fields.name.error.titleNoName, this.titleNoNameValidation)
          .check(errorFor('title', fields.name.title.error.invalid), value =>
            this.titleValidation(value, this.req)
          )
          .check(
            errorFor('first', fields.name.first.error.invalid),
            this.firstValidation
          )
          .check(
            errorFor('last', fields.name.last.error.invalid),
            this.lastValidation
          )
          .check(
            errorFor('organisation', fields.name.organisation.error.invalid),
            this.orgValidation
          )
      },
      { name: this.pcl.fieldMap.postcodeLookup },
      { name: this.pcl.fieldMap.postcodeAddress },
      {
        name: this.pcl.fieldMap.line1,
        validator: text
          .joi(fields.addressLine1.error.required, Joi.string().required())
          .joi(
            fields.addressLine1.error.invalid,
            Joi.string().regex(whitelistNotFirst)
          )
      },
      {
        name: this.pcl.fieldMap.line2,
        validator: text.joi(
          fields.addressLine2.error.invalid,
          Joi.string().regex(whitelistNotFirst).allow('')
        )
      },
      {
        name: this.pcl.fieldMap.town,
        validator: text
          .joi(fields.townCity.error.required, Joi.string().required())
          .joi(
            fields.townCity.error.invalid,
            Joi.string().regex(whitelistNotFirst)
          )
      },
      {
        name: this.pcl.fieldMap.county,
        validator: text
          .joi(fields.county.error.required, Joi.string().required())
          .joi(
            fields.county.error.invalid,
            Joi.string().regex(whitelistNotFirst)
          )
      },
      {
        name: this.pcl.fieldMap.postCode,
        validator: text
          .joi(
            fields.postCode.error.required,
            Joi.string().trim().regex(postCode).required()
          )
          .joi(
            fields.postCode.error.invalidPostcodeIba,
            Joi.string().trim().regex(notNiPostcode)
          )
      },
      {
        name: 'phoneNumber',
        validator: text.joi(
          fields.phoneNumber.error.invalid,
          customJoi.string().trim().validatePhone()
        )
      },
      {
        name: 'emailAddress',
        validator: text.joi(
          fields.emailAddress.error.invalid,
          Joi.string().trim().email(emailOptions).allow('')
        )
      }
    ]);
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
    const repTitle = this.fields.name.title.value || '';
    const first = this.fields.name.first.value;
    const last = this.fields.name.last.value;
    return {
      representative: {
        title: decode(repTitle),
        firstName: decode(first),
        lastName: decode(last),
        organisation: decode(this.fields.name.organisation.value),
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
          postCode: this.fields.postCode.value ?
            this.fields.postCode.value.trim() :
            this.fields.postCode.value,
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
