const { Question } = require('@hmcts/one-per-page/steps');
const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { titleise } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class SameAddress extends Question {
  static get path() {
    return paths.appointee.sameAddress;
  }

  get form() {
    return form({
      isAddressSameAsAppointee: text.joi(
        this.content.fields.isAddressSameAsAppointee.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    return answer(this, {
      question: this.content.cya.isAddressSameAsAppointee.question,
      section: sections.appellantDetails,
      answer: titleise(this.fields.isAddressSameAsAppointee.value)
    });
  }

  values() {
    return {
      appellant: {
        isAddressSameAsAppointee: this.fields.isAddressSameAsAppointee.value === userAnswer.YES
      }
    };
  }

  next() {
    const isAddressSameAsAppointee = this.fields.isAddressSameAsAppointee.value === userAnswer.YES;
    return branch(
      redirectTo(this.journey.steps.TextReminders).if(isAddressSameAsAppointee),
      goTo(this.journey.steps.AppellantContactDetails)
    );
  }
}

module.exports = SameAddress;
