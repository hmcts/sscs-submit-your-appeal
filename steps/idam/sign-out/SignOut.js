const { ExitPoint } = require('@hmcts/one-per-page');
const idam = require('middleware/idam');
const paths = require('paths');
const moment = require('moment');
const content = require('./content.en.json');

class SignOut extends ExitPoint {
  static get path() {
    return paths.idam.signOut;
  }

  getMRNDate() {
    let mrnDate = '';
    if (this.journey.visitedSteps) {
      for (let i = 0; i < this.journey.visitedSteps.length; i++) {
        if (this.journey.visitedSteps[i].name === 'MRNDate' && this.journey.visitedSteps[i].valid) {
          const validDayCount = 35;
          const expiryDate = moment(this.journey.values.mrn.date, 'DD-MM-YYYY')
            .add(validDayCount, 'days');
          mrnDate = expiryDate.format('DD MMMM YYYY');
        }
      }
    }
    return content.body.para2.replace('[mrn-date]', mrnDate);
  }
  get middleware() {
    return [
      idam.authenticate,
      this.journey.collectSteps,
      ...super.middleware,
      idam.logout
    ];
  }
}

module.exports = SignOut;