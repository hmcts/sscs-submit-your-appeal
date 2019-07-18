const { Page } = require('@hmcts/one-per-page');
const idam = require('middleware/idam');
const paths = require('paths');
const moment = require('moment');

class SignOut extends Page {
  static get path() {
    return paths.idam.signOut;
  }

  getMRNDate() {
    if (this.journey.values.mrn && this.journey.values.mrn.date) {
      const validDayCount = 35;
      // eslint-disable-next-line max-len
      const expiryDate = moment(this.journey.values.mrn.date, 'DD-MM-YYYY').add(validDayCount, 'days');
      return expiryDate.format('DD-MM-YYYY');
    }

    return '';
  }
  get middleware() {
    return [
      this.journey.collectSteps,
      ...super.middleware,
      idam.logout
    ];
  }
}

module.exports = SignOut;