const { goTo } = require('@hmcts/one-per-page/flow');
const { text, form } = require('@hmcts/one-per-page/forms');
const { Question } = require('@hmcts/one-per-page/steps');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');

const minNumberOfCharactersInDescription = 5;

class EvidenceDescription extends Question {
  static get path() {
    return paths.reasonsForAppealing.evidenceDescription;
  }

  get form() {
    return form({
      describeTheEvidence: text.joi(
        this.content.fields.describeTheEvidence.error.invalid,
        Joi.string().regex(whitelist))
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

  next() {
    return goTo(this.journey.steps.TheHearing);
  }
}

module.exports = EvidenceDescription;
