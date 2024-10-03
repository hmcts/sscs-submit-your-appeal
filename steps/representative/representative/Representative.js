const { branch, goTo, redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { titleise } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const i18next = require('i18next');

class Representative extends SaveToDraftStore {
  static get path() {
    return paths.representative.representative;
  }

  get form() {
    return form({
      hasRepresentative: text.joi(
        this.content.fields.hasRepresentative.error.required,
        Joi.string().valid(...[userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    const content = require(`./content.${i18next.language}`);

    return answer(this, {
      question: this.content.cya.hasRepresentative.question,
      section: sections.representative,
      answer: titleise(content.cya.hasRepresentative[this.fields.hasRepresentative.value])
    });
  }

  values() {
    return {
      hasRepresentative: this.getHasRepresentativeValue(this.fields.hasRepresentative.value)
    };
  }

  getHasRepresentativeValue(hasRepresentativeValue) {
    if (hasRepresentativeValue === userAnswer.YES) return true;
    if (hasRepresentativeValue === userAnswer.NO) return false;
    return null;
  }

  next() {
    const hasARepresentative = this.fields.hasRepresentative.value === userAnswer.YES;
    return branch(
      redirectTo(this.journey.steps.RepresentativeDetails).if(hasARepresentative),
      goTo(this.journey.steps.ReasonForAppealing)
    );
  }
}

module.exports = Representative;
