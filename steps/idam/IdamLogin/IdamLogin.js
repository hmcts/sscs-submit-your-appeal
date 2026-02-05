const { Question } = require('lib/vendor/one-per-page');
const { redirectTo } = require('lib/vendor/one-per-page/flow');
const { form, text } = require('lib/vendor/one-per-page/forms');
const Joi = require('joi');
const paths = require('paths');

class IdamLogin extends Question {
  static get path() {
    return paths.idam.idamLogin;
  }

  get form() {
    const answers = ['yes', 'no'];
    const validAnswers = Joi.string().valid(answers).required();

    const success = text.joi(this.content.errors.required, validAnswers);

    return form({ success });
  }

  next() {
    return redirectTo(this.journey.steps.Authenticated);
  }
}

module.exports = IdamLogin;
