const { goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftPetitionStoreMiddleware');
const paths = require('paths');

class NotAttendingHearing extends SaveToDraftStore {
  static get path() {
    return paths.hearing.notAttendingHearing;
  }

  get form() {
    return form({
      emailAddress: text.ref(this.journey.steps.AppellantContactDetails, 'emailAddress')
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  get byPostOrEmail() {
    return this.fields.emailAddress.value ? 'email' : 'post';
  }

  next() {
    return goTo(this.journey.steps.CheckYourAppeal);
  }
}

module.exports = NotAttendingHearing;
