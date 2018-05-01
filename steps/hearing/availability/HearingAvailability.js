const { Question } = require('@hmcts/one-per-page/steps');
const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class HearingAvailability extends Question {
  static get path() {
    return paths.hearing.hearingAvailability;
  }

  get form() {
    return form({
      scheduleHearing: text.joi(
        this.content.fields.scheduleHearing.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {
      hearing: {
        scheduleHearing: this.fields.scheduleHearing.value === userAnswer.YES
      }
    };
  }

  next() {
    const shouldScheduleHearing = () => this.fields.scheduleHearing.value === userAnswer.NO;
    return branch(
      goTo(this.journey.steps.CheckYourAppeal).if(shouldScheduleHearing),
      redirectTo(this.journey.steps.DatesCantAttend)
    );
  }
}

module.exports = HearingAvailability;
