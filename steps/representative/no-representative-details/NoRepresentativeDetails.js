const { goTo } = require('@hmcts/one-per-page');
const { form } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const paths = require('paths');

class NoRepresentativeDetails extends SaveToDraftStore {
  static get path() {
    return paths.representative.noRepresentativeDetails;
  }

  get form() {
    return form();
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {
      representative: {
        hasRepresentative: false
      }
    };
  }

  next() {
    return goTo(this.journey.steps.ReasonForAppealing);
  }
}

module.exports = NoRepresentativeDetails;
