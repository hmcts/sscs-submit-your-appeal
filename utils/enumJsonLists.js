const config = require('config');
const request = require('superagent');

let portsOfEntry = null;
let countriesOfResidence = null;

async function requestPortsOfEntry(apiUrl) {
  await request.get(`${apiUrl}/api/citizen/ports-of-entry`)
    .then(res => {
      portsOfEntry = res.body.map(entry => {
        entry.value = entry.locationCode;
        return entry;
      });
    })
    .catch(error => {
      console.error(`Error requesting portOfEntry data from : ${apiUrl}`, error);
      throw error;
    });
}

async function fetchPortsOfEntry() {
  try {
    await requestPortsOfEntry(config.api.url);
  } catch {
    console.log('Requesting from AAT...');
    await requestPortsOfEntry(config.api.aatUrl);
  }
}

function getPortsOfEntry() {
  return portsOfEntry;
}

async function requestCountriesOfResidence(apiUrl) {
  await request.get(`${apiUrl}/api/citizen/countries-of-residence`)
    .then(res => {
      countriesOfResidence = res.body.map(entry => {
        entry.value = entry.label;
        return entry;
      });
    })
    .catch(error => {
      console.error(`Error requesting countriesOfResidence data from : ${apiUrl}`, error);
      throw error;
    });
}

async function fetchCountriesOfResidence() {
  try {
    await requestCountriesOfResidence(config.api.url);
  } catch {
    console.log('Requesting from AAT...');
    await requestCountriesOfResidence(config.api.aatUrl);
  }
}

function getCountriesOfResidence() {
  return countriesOfResidence;
}

module.exports = {
  fetchPortsOfEntry,
  getPortsOfEntry,
  fetchCountriesOfResidence,
  getCountriesOfResidence
};