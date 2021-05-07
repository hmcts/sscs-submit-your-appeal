const config = require('config');
const HttpStatus = require('http-status-codes');
const request = require('superagent');

require('superagent-retry-delay')(request);
const { inwardPostcode } = require('utils/regex');
const logger = require('logger');

const postcodeCountryLookupUrl = config.get('api.url') + config.get('postcodeChecker.endpoint');
const allowedRegionCentres = config.get('postcodeChecker.allowedRpcs')
  .split(',')
  .map(rpc => rpc.trim().toLocaleLowerCase());
const northernIrelandPostcodeStart = 'bt';
const httpRetries = 3;
const retryDelay = 1000;

const postcodeChecker = (postcode, allowUnknownPostcodes = false) => {
  if (postcode.toLocaleLowerCase().startsWith(northernIrelandPostcodeStart)) {
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    const outcode = postcode.trim().replace(inwardPostcode, '').replace(/\s+/, '');

    if (!outcode && !outcode.trim()) {
      resolve(allowUnknownPostcodes);
      return;
    }

    request.get(`${postcodeCountryLookupUrl}/${outcode}`)
      .retry(httpRetries, retryDelay)
      .ok(res => res.status < HttpStatus.INTERNAL_SERVER_ERROR)
      .then(resp => {
        if (resp.status !== HttpStatus.OK) {
          resolve(allowUnknownPostcodes);
          return;
        }

        const regionalCentre = resp.body.regionalCentre.toLocaleLowerCase();
        resolve(allowedRegionCentres.includes(regionalCentre));
      })
      .catch(error => {
        logger.exception(JSON.stringify(error));
        reject(error);
      });
  });
};

module.exports = postcodeChecker;
