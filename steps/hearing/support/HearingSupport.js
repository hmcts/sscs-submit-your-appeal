const { branch, goTo, QuestionWithRequiredNextSteps } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class HearingSupport extends QuestionWithRequiredNextSteps {
  static get path() {
    return paths.hearing.hearingSupport;
  }

  get form() {
    return form({
      arrangements: text.joi(
        this.content.fields.arrangements.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  requiredNextSteps() {
    return [
      this.journey.steps.HearingArrangements,
      this.journey.steps.HearingAvailability
    ];
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
    const makeHearingArrangements = this.fields.arrangements.value === userAnswer.YES;
    return branch(
      goTo(this.journey.steps.HearingArrangements).if(makeHearingArrangements),
      goTo(this.journey.steps.HearingAvailability)
    );
  }
}

module.exports = HearingSupport;
