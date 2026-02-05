const { branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class HearingSupport extends SaveToDraftStore {
  static get path() {
    return paths.hearing.hearingSupport;
  }

  get form() {
    return form({
      arrangements: text.joi(
        this.content.fields.arrangements.error.required,
        Joi.string()
          .valid(...[userAnswer.YES, userAnswer.NO])
          .required()
      )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {
      hearing: {
        wantsSupport: this.fields.arrangements.value === userAnswer.YES
      }
    };
  }

  next() {
    const makeHearingArrangements =
      this.fields.arrangements.value === userAnswer.YES;
    return branch(
      redirectTo(this.journey.steps.HearingArrangements).if(
        makeHearingArrangements
      ),
      redirectTo(this.journey.steps.HearingAvailability)
    );
  }
}

module.exports = HearingSupport;
