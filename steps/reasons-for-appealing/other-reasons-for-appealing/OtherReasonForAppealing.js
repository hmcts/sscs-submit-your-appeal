const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { whitelist } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const Joi = require('joi');
const userAnswer = require('utils/answer');

class OtherReasonForAppealing extends Question {
  static get path() {
    return paths.reasonsForAppealing.otherReasonForAppealing;
  }

  get form() {
    return form({
      otherReasonForAppealing: text.joi(
        this.content.fields.otherReasonForAppealing.error.invalid,
        Joi.string().regex(whitelist).allow('')
      )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.otherReasonForAppealing.question,
        section: sections.reasonsForAppealing,
        answer: this.fields.otherReasonForAppealing.value || userAnswer.NOT_REQUIRED
      })
    ];
  }

  values() {
    return {
      reasonsForAppealing: {
        otherReasons: this.fields.otherReasonForAppealing.value
      }
    };
  }

  next() {
    // console.log(this.journey);
    return goTo(this.journey.steps.SendingEvidence);
  }
}

module.exports = OtherReasonForAppealing;
