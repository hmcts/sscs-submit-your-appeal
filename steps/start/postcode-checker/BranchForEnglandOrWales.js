const { branch, goTo } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { Logger } = require('@hmcts/nodejs-logging');
const postcodeChecker = require('utils/postcodeChecker');

const logger = Logger.getLogger('PostcodeChecker.js');

class BranchForEnglandOrWales {
  constructor(postcode, englandOrWalesStep, otherStep, errorStep) {
    this.postcode = postcode;
    this.englandOrWalesStep = englandOrWalesStep;
    this.otherStep = otherStep;
    this.errorStep = errorStep;
  }

  isEnglandOrWalesPostcode() {
    return postcodeChecker(this.postcode);
  }

  redirect(req, res) {
    return this.isEnglandOrWalesPostcode().then(isEnglandOrWalesPostcode => {
      branch(
        goTo(this.englandOrWalesStep).if(isEnglandOrWalesPostcode),
        goTo(this.otherStep)
      ).redirect(req, res);
    }).catch(error => {
      logger.error(error);
      redirectTo(this.errorStep).redirect(req, res);
    });
  }

  get step() {
    return this.englandOrWalesStep;
  }
}

module.exports = BranchForEnglandOrWales;
