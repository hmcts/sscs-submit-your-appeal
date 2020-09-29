const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, object, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const paths = require('paths');
const validOptions = require('steps/hearing/options/options');
const emailOptions = require('utils/emailOptions');
const customJoi = require('utils/customJoiSchemas');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');
const Joi = require('joi');
const {
  emptyTelephoneValidation,
  emptyEmailValidation
} = require('steps/hearing/options/optionsValidation');

class HearingOptions extends SaveToDraftStore {
  static get path() {
    return paths.hearing.hearingOptions;
  }

  get form() {
    return form({
      selectOptions: object({
        option: text.joi(
          this.content.fields.options.error.required,
          Joi.string().valid([validOptions.telephone, validOptions.video, validOptions.faceToFace]).required()
        ),
        telephone: text.joi(
          this.content.fields.options.telephone.error.invalid,
          customJoi.string().trim().validatePhone()
        ),
        email: text.joi(
          this.content.fields.options.video.error.invalid,
          Joi.string().trim().email(emailOptions).allow('')
        )
      }).check(
        errorFor('telephone', this.content.fields.options.telephone.error.required),
        value => emptyTelephoneValidation(value)
      ).check(
        errorFor('email', this.content.fields.options.video.error.required),
        value => emptyEmailValidation(value)
      )
    });
  }

  get telephone() {
    const values = this.req.journey.values;
    if (values && values.appellant && values.appellant.contactDetails) {
      return values.appellant.contactDetails.phoneNumber;
    }
    return null;
  }

  get email() {
    const values = this.req.journey.values;
    if (values && values.appellant && values.appellant.contactDetails) {
      return values.appellant.contactDetails.emailAddress;
    }
    return null;
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    const telephoneSelected = validOptions.telephone === this.fields.selectOptions.option.value;
    const videoSelected = validOptions.video === this.fields.selectOptions.option.value;
    const f2fSelected = validOptions.faceToFace === this.fields.selectOptions.option.value;
    const telephone = telephoneSelected ? this.fields.selectOptions.telephone.value : null;
    const email = videoSelected ? this.fields.selectOptions.email.value : null;
    return {
      hearing: {
        options: {
          hearingTypeTelephone: telephoneSelected,
          telephone,
          hearingTypeVideo: videoSelected,
          email,
          hearingTypeFaceToFace: f2fSelected
        }
      }
    };
  }

  next() {
    return redirectTo(this.journey.steps.HearingSupport);
  }
}

module.exports = HearingOptions;
