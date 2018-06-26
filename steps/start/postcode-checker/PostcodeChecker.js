const { Question } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { postCode } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');

const BranchForEnglandOrWales = require('steps/start/postcode-checker/BranchForEnglandOrWales');


class PostcodeChecker extends Question {
  static get path() {
    return paths.start.postcodeCheck;
  }

  get form() {
    return form({
      postcode: text
        .joi(this.content.fields.postcode.error.emptyField, Joi.string().required())
        .joi(this.content.fields.postcode.error.invalid, Joi.string().trim().regex(postCode))
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {
      postCodeCheck: this.fields.postcode.value
    };
  }

  next() {
    return new BranchForEnglandOrWales(
      this.fields.postcode.value,
      this.journey.steps.Appointee,
      this.journey.steps.InvalidPostcode,
      this.journey.steps.Error500
    );
  }
}

module.exports = PostcodeChecker;
