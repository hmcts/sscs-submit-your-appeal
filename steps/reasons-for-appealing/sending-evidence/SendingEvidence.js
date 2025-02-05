const { goTo } = require('@hmcts/one-per-page');
const { form, text, ref } = require('@hmcts/one-per-page/forms');
const { Interstitial } = require('@hmcts/one-per-page/steps');
const paths = require('paths');

class SendingEvidence extends Interstitial {
  static get path() {
    return paths.reasonsForAppealing.sendingEvidence;
  }

  get hasSignedUpForEmail() {
    const appellantEmailField = form({
      emailAddress: ref(
        this.journey.steps.AppellantContactDetails,
        text,
        'emailAddress'
      )
    });
    const emailFieldValue = appellantEmailField.retrieve(
      this.journey.steps.AppellantContactDetails,
      this.req
    ).emailAddress.value;

    if (typeof emailFieldValue === 'undefined') {
      return false;
    }

    return emailFieldValue.length > 0;
  }

  next() {
    return goTo(this.journey.steps.TheHearing);
  }
}

module.exports = SendingEvidence;
