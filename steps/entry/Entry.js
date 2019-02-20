const { EntryPoint, goTo } = require('@hmcts/one-per-page');
// const idam = require('middleware/idam');
const paths = require('paths');

class Entry extends EntryPoint {
  static get path() {
    return paths.session.entry;
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }

  // get middleware() {
  //   return [...super.middleware, idam.authenticate];
  // }
}

module.exports = Entry;
