const { redirectTo } = require('lib/vendor/one-per-page/flow');
const { form, text } = require('lib/vendor/one-per-page/forms');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const paths = require('paths');

class NotAttendingHearing extends SaveToDraftStore {
  static get path() {
    return paths.hearing.notAttendingHearing;
  }

  get form() {
    return form({
      emailAddress: text.ref(
        this.journey.steps.AppellantContactDetails,
        'emailAddress'
      )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  get byPostOrEmail() {
    return this.fields.emailAddress.value ? 'email' : 'post';
  }

  next() {
    return redirectTo(this.journey.steps.Pcq);
  }
}

module.exports = NotAttendingHearing;
