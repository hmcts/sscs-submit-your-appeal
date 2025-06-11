const { branch, goTo } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const logger = require('logger');
const postcodeChecker = require('utils/postcodeChecker');

const logPath = 'BranchForEnglandWales.js';
class BranchForEnglandOrWales {
  constructor(postcode, englandOrWalesStep, otherStep, errorStep) {
    this.postcode = postcode;
    this.englandOrWalesStep = englandOrWalesStep;
    this.otherStep = otherStep;
    this.errorStep = errorStep;
  }

  isEnglandOrWalesPostcode() {
    return postcodeChecker(this.postcode, false);
  }

  redirect(req, res) {
    return this.isEnglandOrWalesPostcode()
      .then((isEnglandOrWalesPostcode) => {
        branch(
          goTo(this.englandOrWalesStep).if(isEnglandOrWalesPostcode),
          goTo(this.otherStep)
        ).redirect(req, res);
      })
      .catch((error) => {
        logger.trace(error, logPath);
        redirectTo(this.errorStep).redirect(req, res);
      });
  }

  get step() {
    return this.englandOrWalesStep;
  }
}

module.exports = BranchForEnglandOrWales;
