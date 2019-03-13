const { Question, goTo } = require('@hmcts/one-per-page');
const paths = require('paths');
const idam = require('middleware/idam');

class IdamRedirect extends Question {
  static get path() {
    return paths.start.idamRedirect;
  }

  next() {
    return goTo(this.journey.steps.CheckYourAppeal);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.authenticate
    ];
  }
}

module.exports = IdamRedirect;
