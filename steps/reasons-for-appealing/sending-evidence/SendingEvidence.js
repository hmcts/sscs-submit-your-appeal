const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const paths = require('paths');
const { get } = require('lodash');

const evidenceUploadEnabled = get(require('config'), 'features.evidenceUpload.enabled');

class SendingEvidence extends Question {
  static get path() {
    return paths.reasonsForAppealing.sendingEvidence;
  }

  get hasSignedUpForEmail() {
    if (typeof this.fields.emailAddress.value === 'undefined') {
      return false;
    }

    return this.fields.emailAddress.value.length > 0;
  }

  get form() {
    return form({
      emailAddress: text.ref(this.journey.steps.AppellantContactDetails, 'emailAddress')
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  next() {
    const followingStep = evidenceUploadEnabled ? 'EvidenceUpload' : 'TheHearing';
    return goTo(this.journey.steps[followingStep]);
  }
}

module.exports = SendingEvidence;
