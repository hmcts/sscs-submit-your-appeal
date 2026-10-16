const { goTo } = require('lib/vendor/one-per-page/flow');
const { text, form } = require('lib/vendor/one-per-page/forms');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');

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
