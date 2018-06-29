const { branch, goTo } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { Logger } = require('@hmcts/nodejs-logging');
const config = require('config');
const HttpStatus = require('http-status-codes');
const request = require('superagent');

const postcodeCountryLookupUrl = config.get('postcodeChecker.url');
const postcodeCountryLookupRegionCentres = ['glasgow'];
const northernIslandPostcodeStart = 'bt';

const logger = Logger.getLogger('PostcodeChecker.js');

class BranchForEnglandOrWales {
  constructor(postcode, englandOrWalesStep, otherStep, errorStep) {
    this.postcode = postcode;
    this.englandOrWalesStep = englandOrWalesStep;
    this.otherStep = otherStep;
    this.errorStep = errorStep;
  }

  isEnglandOrWalesPostcode() {
    const postcode = this.postcode;
    if (postcode.toLocaleLowerCase().startsWith(northernIslandPostcodeStart)) {
      return Promise.resolve(false);
    }

    return new Promise((resolve, reject) => {
      request.get(`${postcodeCountryLookupUrl}/${postcode}`)
        .ok(res => res.status < HttpStatus.INTERNAL_SERVER_ERROR)
        .then(resp => {
          if (resp.status !== HttpStatus.OK) {
            resolve(false);
            return;
          }

          const regionalCentre = resp.body.regionalcentre.toLocaleLowerCase();
          resolve(!postcodeCountryLookupRegionCentres.includes(regionalCentre));
        })
        .catch(error => {
          reject(error);
        });
    });
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
