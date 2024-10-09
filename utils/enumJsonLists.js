const axios = require('axios');
const config = require('config');

let portOfEntries = null;
let countryOfResidences = null;

async function fetchPortOfEntries() {
  try {
    const res = await axios.get(`${config.api.url}/api/port-of-entries`);
    portOfEntries = res.data.map(entry => {
      entry.value = entry.label;
      return entry;
    });
  } catch (error) {
    console.log('Error fetching portOfEntry data: ', error);
  }
}

function setPortOfEntries(someList) {
  portOfEntries = someList;
}

function getPortOfEntries() {
  return portOfEntries;
}


async function fetchCountryOfResidences() {
  try {
    const res = await axios.get(`${config.api.url}/api/country-of-residences`);
    countryOfResidences = res.data.map(entry => {
      entry.value = entry.label;
      return entry;
    });
  } catch (error) {
    console.log('Error fetching countryOfResidences data: ', error);
  }
}

function setCountryOfResidences(someList) {
  countryOfResidences = someList;
}

function getCountryOfResidences() {
  return countryOfResidences;
}

module.exports = {
  fetchPortOfEntries,
  getPortOfEntries,
  setPortOfEntries,
  fetchCountryOfResidences,
  getCountryOfResidences,
  setCountryOfResidences
};