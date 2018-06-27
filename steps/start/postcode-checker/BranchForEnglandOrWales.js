const { branch, goTo } = require('@hmcts/one-per-page');
const { Logger } = require('@hmcts/nodejs-logging');
const config = require('config');
const HttpStatus = require('http-status-codes');
const request = require('superagent');

const postcodeCountryLookupUrl = config.get('postcodeChecker.url');
const postcodeCountryLookupToken = config.get('postcodeChecker.token');
const postcodeCountryLookupAllowedCountries = ['england', 'wales'];

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
    return new Promise((resolve, reject) => {
      request.get(`${postcodeCountryLookupUrl}/${postcode}`)
        .set('Authorization', `Token ${postcodeCountryLookupToken}`)
        .then(resp => {
          if (resp.statusCode !== HttpStatus.OK) {
            resolve(false);
          }

          const country = resp.body.country.name.toLocaleLowerCase();
          resolve(postcodeCountryLookupAllowedCountries.includes(country));
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  redirect(req, res) {
    this.isEnglandOrWalesPostcode().then(isEnglandOrWalesPostcode => {
      branch(
        goTo(this.englandOrWalesStep).if(isEnglandOrWalesPostcode),
        goTo(this.otherStep)
      ).redirect(req, res);
    }).catch(error => {
      logger.error(error);
      goTo(this.errorStep).redirect(req, res);
    });
  }

  get step() {
    return this.englandOrWalesStep;
  }
}

module.exports = BranchForEnglandOrWales;
