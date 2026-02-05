const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class HearingAvailability extends SaveToDraftStore {
  static get path() {
    return paths.hearing.hearingAvailability;
  }

  get form() {
    return form({
      scheduleHearing: text.joi(
        this.content.fields.scheduleHearing.error.required,
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
        scheduleHearing: this.getScheduleHearingValue(
          this.fields.scheduleHearing.value
        )
      }
    };
  }

  getScheduleHearingValue(scheduleHearingValue) {
    if (scheduleHearingValue === userAnswer.YES) return true;
    if (scheduleHearingValue === userAnswer.NO) return false;
    return null;
  }

  next() {
    const shouldScheduleHearing = () =>
      this.fields.scheduleHearing.value === userAnswer.NO;
    return branch(
      redirectTo(this.journey.steps.Pcq).if(shouldScheduleHearing),
      redirectTo(this.journey.steps.DatesCantAttend)
    );
  }
}

module.exports = HearingAvailability;
