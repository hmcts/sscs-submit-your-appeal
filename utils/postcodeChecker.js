const config = require('config');
const HttpStatus = require('http-status-codes');
const request = require('superagent');

const postcodeCountryLookupUrl = config.get('postcodeChecker.url');
const disallowedRegionCentres = ['glasgow'];
const northernIrelandPostcodeStart = 'bt';

const postcodeChecker = (postcode, allowUnknownPostcodes = false) => {
  if (postcode.toLocaleLowerCase().startsWith(northernIrelandPostcodeStart)) {
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    request.get(`${postcodeCountryLookupUrl}/${postcode}`)
      .ok(res => res.status < HttpStatus.INTERNAL_SERVER_ERROR)
      .then(resp => {
        if (resp.status !== HttpStatus.OK) {
          resolve(allowUnknownPostcodes);
          return;
        }

        const regionalCentre = resp.body.regionalcentre.toLocaleLowerCase();
        resolve(!disallowedRegionCentres.includes(regionalCentre));
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = postcodeChecker;