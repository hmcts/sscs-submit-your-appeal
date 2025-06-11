/* eslint-disable no-await-in-loop */
const config = require('config');
const request = require('superagent');

let portsOfEntry = null;
let countriesOfResidence = null;

async function fetchPortsOfEntry() {
  await request
    .get(`${config.api.url}/api/citizen/ports-of-entry`)
    .then((res) => {
      portsOfEntry = res.body.map((entry) => {
        entry.value = entry.locationCode;
        return entry;
      });
    })
    .catch((error) => {
      console.error('Error fetching portOfEntry data: ', error);
    });
}

function getPortsOfEntry() {
  return portsOfEntry;
}

async function fetchCountriesOfResidence() {
  await request
    .get(`${config.api.url}/api/citizen/countries-of-residence`)
    .then((res) => {
      countriesOfResidence = res.body.map((entry) => {
        entry.value = entry.label;
        return entry;
      });
    })
    .catch((error) => {
      console.error('Error fetching countriesOfResidence data: ', error);
    });
}

function getCountriesOfResidence() {
  return countriesOfResidence;
}

async function fetchAndSetPortsAndCountries() {
  const fetchLimit = 5;
  for (let i = 0; i < fetchLimit; i++) {
    await Promise.all([fetchPortsOfEntry(), fetchCountriesOfResidence()]);
    if (getPortsOfEntry().length > 0 && getCountriesOfResidence().length > 0) {
      break;
    }
  }
}

module.exports = {
  fetchPortsOfEntry,
  getPortsOfEntry,
  fetchCountriesOfResidence,
  getCountriesOfResidence,
  fetchAndSetPortsAndCountries
};
