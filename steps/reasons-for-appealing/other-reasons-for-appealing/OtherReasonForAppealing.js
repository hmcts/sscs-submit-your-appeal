const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const userAnswer = require('utils/answer');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

class OtherReasonForAppealing extends Question {
  static get path() {
    return paths.reasonsForAppealing.otherReasonForAppealing;
  }

  get form() {
    return form({
      otherReasonForAppealing: text
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.otherReasonForAppealing.question,
        section: sections.reasonsForAppealing,
        answer: this.fields.otherReasonForAppealing.value || userAnswer.NOT_REQUIRED
      })
    ];
  }

  values() {
    return {
      reasonsForAppealing: {
        otherReasons: this.fields.otherReasonForAppealing.value
      }
    };
  }

  next() {
    const followingStep = evidenceUploadEnabled ? 'EvidenceProvide' : 'SendingEvidence';
    return goTo(this.journey.steps[followingStep]);
  }
}

module.exports = OtherReasonForAppealing;
