const { goTo } = require('@hmcts/one-per-page/flow');
const { text, form } = require('@hmcts/one-per-page/forms');
const { SaveToDraftStore } = require('middleware/draftPetitionStoreMiddleware');
const { whitelist } = require('utils/regex');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');

const minNumberOfCharactersInDescription = 5;

class EvidenceDescription extends SaveToDraftStore {
  static get path() {
    return paths.reasonsForAppealing.evidenceDescription;
  }

  get form() {
    return form({
      describeTheEvidence: text.joi(
        this.content.fields.describeTheEvidence.error.invalid,
        Joi.string().regex(whitelist))
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
    return answer(this, { hide: true });
  }

  next() {
    return goTo(this.journey.steps.TheHearing);
  }
}

module.exports = EvidenceDescription;
