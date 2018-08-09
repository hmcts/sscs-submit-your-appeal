const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const DateUtils = require('utils/DateUtils');


class HaveAMRN extends Question {
  static get path() {
    return paths.compliance.haveAMRN;
  }

  get form() {
    return form({
      haveAMRN: text.joi(
        this.content.fields.haveAMRN.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {
      mrn: {
        dateAppealSubmitted: DateUtils.getCurrentDate()
      }
    };
  }

  next() {
    const hasAMRN = this.fields.haveAMRN.value === userAnswer.YES;
    return branch(
      goTo(this.journey.steps.DWPIssuingOffice).if(hasAMRN),
      goTo(this.journey.steps.HaveContactedDWP)
    );
  }
}

module.exports = HaveAMRN;
