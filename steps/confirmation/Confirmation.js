const { shimSessionExitPoint } = require('middleware/shimSession');
const { get } = require('lodash');
const paths = require('paths');
const urls = require('urls');
const preserveSession = require('middleware/preserveSession');
const checkWelshToggle = require('middleware/checkWelshToggle');

class Confirmation extends shimSessionExitPoint {
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
      checkWelshToggle,
      ...super.middleware
    ];
  }

  get surveyLink() {
    return urls.surveyLink;
  }
}

module.exports = Confirmation;
