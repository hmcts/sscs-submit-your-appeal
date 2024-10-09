const axios = require('axios');
const config = require('config');

let portsOfEntry = null;
let countriesOfResidence = null;

async function fetchPortsOfEntry() {
  try {
    const res = await axios.get(`${config.api.url}/api/citizen/ports-of-entry`);
    portsOfEntry = res.data.map(entry => {
      entry.value = entry.label;
      return entry;
    });
  } catch (error) {
    console.log('Error fetching portOfEntry data: ', error);
  }
}

function setPortsOfEntry(someList) {
  portsOfEntry = someList;
}

function getPortsOfEntry() {
  return portsOfEntry;
}


async function fetchCountriesOfResidence() {
  try {
    const res = await axios.get(`${config.api.url}/api/citizen/countries-of-residence`);
    countriesOfResidence = res.data.map(entry => {
      entry.value = entry.label;
      return entry;
    });
  } catch (error) {
    console.log('Error fetching countriesOfResidence data: ', error);
  }
}

function setCountriesOfResidence(someList) {
  countriesOfResidence = someList;
}

function getCountriesOfResidence() {
  return countriesOfResidence;
}

module.exports = {
  fetchPortsOfEntry,
  getPortsOfEntry,
  setPortsOfEntry,
  fetchCountriesOfResidence,
  getCountriesOfResidence,
  setCountriesOfResidence
};