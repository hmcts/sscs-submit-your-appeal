const config = require('config');
const HttpStatus = require('http-status-codes');
const request = require('superagent');
const { inwardPostcode } = require('utils/regex');
const logger = require('logger');

const allowNI = config.get('features.allowNI.enabled');

const postcodeCountryLookupUrl =
  config.get('api.url') + config.get('postcodeChecker.endpoint');
const allowedRegionCentres = config
  .get('postcodeChecker.allowedRpcs')
  .split(',')
  .map((rpc) => rpc.trim().toLocaleLowerCase());
const northernIrelandPostcodeStart = 'bt';
const httpRetries = 3;

const postcodeChecker = (
  postcode,
  allowUnknownPostcodes = false,
  isIba = false
) => {
  const isNiPostcode = postcode
    .toLocaleLowerCase()
    .startsWith(northernIrelandPostcodeStart);
  if (isNiPostcode && (!allowNI || !isIba)) {
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    const outcode = postcode
      .trim()
      .replace(inwardPostcode, '')
      .replace(/\s+/, '');

    if (!outcode && !outcode.trim()) {
      resolve(allowUnknownPostcodes);
      return;
    }

    request
      .get(`${postcodeCountryLookupUrl}/${outcode}`)
      .retry(httpRetries)
      .ok((res) => res.status < HttpStatus.INTERNAL_SERVER_ERROR)
      .then((resp) => {
        if (resp.status !== HttpStatus.OK) {
          resolve(allowUnknownPostcodes);
          return;
        }
        if (isNiPostcode) {
          resolve(true);
        } else {
          const regionalCentre = resp.body.regionalCentre.toLocaleLowerCase();
          resolve(allowedRegionCentres.includes(regionalCentre));
        }
      })
      .catch((error) => {
        logger.exception(JSON.stringify(error));
        reject(error);
      });
  });
};

module.exports = postcodeChecker;
