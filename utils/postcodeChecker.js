const config = require('config');
const HttpStatus = require('http-status-codes');
const request = require('superagent');
const { inwardPostcode } = require('utils/regex');

const postcodeCountryLookupUrl = config.get('api.url') + config.get('postcodeChecker.endpoint');
const disallowedRegionCentres = ['glasgow'];
const northernIrelandPostcodeStart = 'bt';

const postcodeChecker = (postcode, allowUnknownPostcodes = false) => {
  if (postcode.toLocaleLowerCase().startsWith(northernIrelandPostcodeStart)) {
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    const outcode = postcode.trim().replace(inwardPostcode, '').replace(/\s+/, '');

    request.get(`${postcodeCountryLookupUrl}/${outcode}`)
      .ok(res => res.status < HttpStatus.INTERNAL_SERVER_ERROR)
      .then(resp => {
        if (resp.status !== HttpStatus.OK) {
          resolve(allowUnknownPostcodes);
          return;
        }

        const regionalCentre = resp.body.regionalCentre.toLocaleLowerCase();
        resolve(!disallowedRegionCentres.includes(regionalCentre));
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = postcodeChecker;