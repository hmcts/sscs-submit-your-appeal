const { goTo } = require('@hmcts/one-per-page/flow');
const { text, form } = require('@hmcts/one-per-page/forms');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');
const checkWelshToggle = require('middleware/checkWelshToggle');

const minNumberOfCharactersInDescription = 5;

class EvidenceDescription extends SaveToDraftStore {
  static get path() {
    return paths.reasonsForAppealing.evidenceDescription;
  }

  get form() {
    return form({
      describeTheEvidence: text
        .joi(
          this.content.fields.describeTheEvidence.error.noContent,
          Joi.string().required()
        )
        .joi(
          this.content.fields.describeTheEvidence.error.tooShort,
          Joi.string().min(minNumberOfCharactersInDescription)
        )
    });
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }

  values() {
    return {
      reasonsForAppealing: {
        evidenceDescription: this.fields.describeTheEvidence.value
      }
    };
  }

  answers() {
    return answer(this, {
      question: this.content.cya.evidenceDescription.question,
      section: sections.reasonsForAppealing,
      answer: this.fields.describeTheEvidence.value
    });
  }

  next() {
    return goTo(this.journey.steps.TheHearing);
  }
}

module.exports = EvidenceDescription;
