const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');

class EvidenceUpload extends Question {
  static get path() {
    return paths.reasonsForAppealing.evidenceUpload;
  }

  get form() {
    return form({
      uploadEv: text.joi(
        'some error',
        Joi.any().required()
      )
    });
  }


  values() {
    return {
      reasonsForAppealing: {
        otherReasons: this.fields.otherReasonForAppealing.value
      }
    };
  }

  next() {
    return goTo(this.journey.steps.TheHearing);
  }
}

module.exports = EvidenceUpload;
