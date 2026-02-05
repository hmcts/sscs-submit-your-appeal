const { branch, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { titleise } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const i18next = require('i18next');
const { isIba } = require('utils/benefitTypeUtils');

class Representative extends SaveToDraftStore {
  static get path() {
    return paths.representative.representative;
  }

  get form() {
    return form({
      hasRepresentative: text.joi(
        this.content.fields.hasRepresentative.error.required,
        Joi.string()
          .valid(...[userAnswer.YES, userAnswer.NO])
          .required()
      )
    });
  }

  answers() {
    const content = require(`./content.${i18next.language}`);

    return answer(this, {
      question: this.content.cya.hasRepresentative.question,
      section: sections.representative,
      answer: titleise(
        content.cya.hasRepresentative[this.fields.hasRepresentative.value]
      )
    });
  }

  values() {
    return {
      hasRepresentative: this.getHasRepresentativeValue(
        this.fields.hasRepresentative.value
      )
    };
  }

  getHasRepresentativeValue(hasRepresentativeValue) {
    if (hasRepresentativeValue === userAnswer.YES) return true;
    if (hasRepresentativeValue === userAnswer.NO) return false;
    return null;
  }

  next() {
    const hasARepresentative =
      this.fields.hasRepresentative.value === userAnswer.YES;
    const isIbaCase = isIba(this.req);
    return branch(
      goTo(this.journey.steps.RepresentativeDetails).if(
        hasARepresentative && !isIbaCase
      ),
      goTo(this.journey.steps.RepresentativeInMainlandUk).if(
        hasARepresentative && isIbaCase
      ),
      goTo(this.journey.steps.ReasonForAppealing)
    );
  }
}

module.exports = Representative;
