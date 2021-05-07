const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, object, text, bool } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const i18next = require('i18next');
const { setCYAValue } = require('steps/hearing/options/cyaHearingOptionsUtils');
const paths = require('paths');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');
const {
  emptyTelephoneValidation,
  invalidTelephoneValidation,
  emptyEmailValidation,
  invalidEmailValidation,
  optionSelected
} = require('steps/hearing/options/optionsValidation');

class HearingOptions extends SaveToDraftStore {
  static get path() {
    return paths.hearing.hearingOptions;
  }

  get form() {
    return form({
      selectOptions: object({
        telephone: object({
          requested: bool.default(false),
          phoneNumber: text
        }).check(
          errorFor('phoneNumber', this.content.fields.options.telephone.error.required),
          value => emptyTelephoneValidation(value)
        ).check(
          errorFor('phoneNumber', this.content.fields.options.telephone.error.invalid),
          value => invalidTelephoneValidation(value)
        ),
        video: object({
          requested: bool.default(false),
          email: text
        }).check(
          errorFor('email', this.content.fields.options.video.error.required),
          value => emptyEmailValidation(value)
        ).check(
          errorFor('email', this.content.fields.options.video.error.invalid),
          value => invalidEmailValidation(value)
        ),
        faceToFace: object({
          requested: bool.default(false)
        })
      }).check(
        this.content.fields.options.error.required,
        value => optionSelected(value)
      )
    });
  }

  get phoneNumber() {
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
    return [
      answer(this, {
        section: sections.hearingOptions,
        template: 'answer.html'
      })
    ];
  }

  values() {
    const selectOptions = this.fields.selectOptions;
    const telephoneSelected = Boolean(selectOptions.telephone.requested.value);
    const videoSelected = Boolean(selectOptions.video.requested.value);
    const f2fSelected = Boolean(selectOptions.faceToFace.requested.value);
    const telephone = telephoneSelected ? selectOptions.telephone.phoneNumber.value : null;
    const email = videoSelected ? selectOptions.video.email.value : null;
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


  get cyaOptions() {
    const selectOptions = this.fields.selectOptions.value;
    const sessionLanguage = i18next.language;
    const cyaContent = require(`./content.${sessionLanguage}`).cya;

    const setRequestedOrNotRequested = value => (value ? cyaContent.requested : cyaContent.notRequested);

    const arrangementsAnswer = {
      hearingTypeTelephone: setRequestedOrNotRequested(selectOptions.telephone.requested),
      hearingTypeVideo: setRequestedOrNotRequested(selectOptions.video.requested),
      hearingTypeFaceToFace: setRequestedOrNotRequested(selectOptions.faceToFace.requested)
    };

    arrangementsAnswer.hearingTypeTelephone = setCYAValue(
      arrangementsAnswer.hearingTypeTelephone, selectOptions.telephone.phoneNumber);

    arrangementsAnswer.hearingTypeVideo = setCYAValue(
      arrangementsAnswer.hearingTypeVideo, selectOptions.video.email);

    return arrangementsAnswer;
  }

  next() {
    return redirectTo(this.journey.steps.HearingSupport);
  }
}

module.exports = HearingOptions;
