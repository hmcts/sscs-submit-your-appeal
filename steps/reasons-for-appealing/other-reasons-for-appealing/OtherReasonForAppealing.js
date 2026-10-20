const { goTo } = require('lib/vendor/one-per-page');
const { form, text } = require('lib/vendor/one-per-page/forms');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const userAnswer = require('utils/answer');
const { decode } = require('utils/stringUtils');
const evidenceUploadEnabled = require('config').get(
  'features.evidenceUpload.enabled'
);
const { isIba } = require('utils/benefitTypeUtils');
const i18next = require('i18next');

class OtherReasonForAppealing extends SaveToDraftStore {
  static get path() {
    return paths.reasonsForAppealing.otherReasonForAppealing;
  }

  get suffix() {
    return isIba(this.req) ? 'Iba' : '';
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
        answer:
          decode(this.fields.otherReasonForAppealing.value) ||
          userAnswer[i18next.language].NOT_REQUIRED
      })
    ];
  }

  values() {
    return {
      reasonsForAppealing: {
        otherReasons: decode(this.fields.otherReasonForAppealing.value)
      }
    };
  }

  next() {
    const followingStep = evidenceUploadEnabled ?
      'EvidenceProvide' :
      'SendingEvidence';
    return goTo(this.journey.steps[followingStep]);
  }
}

module.exports = OtherReasonForAppealing;
