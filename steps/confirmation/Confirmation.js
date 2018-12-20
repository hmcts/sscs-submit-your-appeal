const { ExitPoint } = require('@hmcts/one-per-page');
const { get } = require('lodash');
const paths = require('paths');
const urls = require('urls');
const preserveSession = require('middleware/preserveSession');

class Confirmation extends ExitPoint {
  static get path() {
    return paths.confirmation;
  }

  get session() {
    return this.req.sess;
  }

  get paperCase() {
    return get(this, 'session.TheHearing.attendHearing') === 'no';
  }

  get oralCase() {
    return !this.paperCase;
  }

  get middleware() {
    return [
      preserveSession,
      ...super.middleware
    ];
  }

  get surveyLink() {
    return urls.surveyLink;
  }
}

module.exports = Confirmation;
