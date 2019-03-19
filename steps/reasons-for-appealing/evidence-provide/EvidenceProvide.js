const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const Joi = require('joi');
const { titleise } = require('utils/stringUtils');
const userAnswer = require('utils/answer');

class EvidenceProvide extends SaveToDraftStore {
  static get path() {
    return paths.reasonsForAppealing.evidenceProvide;
  }

  get form() {
    return form({
      evidenceProvide: text.joi(
        this.content.fields.evidenceProvide.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    return answer(this, {
      question: this.content.cya.evidenceProvide.question,
      section: sections.reasonsForAppealing,
      answer: titleise(this.fields.evidenceProvide.value)
    });
  }

  values() {
    return {
      evidenceProvide: this.fields.evidenceProvide.value === userAnswer.YES
    };
  }

  next() {
    const evidenceProvide = this.fields.evidenceProvide.value === userAnswer.YES;
    return branch(
      redirectTo(this.journey.steps.EvidenceUpload).if(evidenceProvide),
      goTo(this.journey.steps.TheHearing)
    );
  }
}

module.exports = EvidenceProvide;
