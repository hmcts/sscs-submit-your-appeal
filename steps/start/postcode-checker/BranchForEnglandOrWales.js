const { branch, goTo } = require('@hmcts/one-per-page');
const { Logger } = require('@hmcts/nodejs-logging');
const request = require('request');
const config = require('config');
const HttpStatus = require('http-status-codes');

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
      request.get({
        headers: {
          Authorization: `Token ${postcodeCountryLookupToken}`
        },
        url: `${postcodeCountryLookupUrl}/${postcode}`
      }, (error, resp, body) => {
        if (error) {
          return reject(error);
        }

        if (resp.statusCode !== HttpStatus.OK) {
          return resolve(false);
        }
        const postcodeLook = JSON.parse(body);

        const country = postcodeLook.country.name.toLocaleLowerCase();
        return resolve(
          postcodeCountryLookupAllowedCountries.includes(country)
        );
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
