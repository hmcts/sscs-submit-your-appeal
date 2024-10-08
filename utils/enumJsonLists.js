const axios = require('axios');

let portOfEntries = null;
let countryOfResidences = null;

const getCaseApiUrl = () => {
  let caseApiUrl = 'http://localhost:8008';
  if ((process.env.TRIBUNALS_CASE_API_URL || null) !== null) {
    caseApiUrl = process.env.TRIBUNALS_CASE_API_URL;
  }
  return caseApiUrl;
};

async function fetchPortOfEntries() {
  try {
    const caseApiUrl = getCaseApiUrl();
    console.log(caseApiUrl);
    const res = await axios.get(`${caseApiUrl}/api/port-of-entries`);
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
    const res = await axios.get(`${getCaseApiUrl()}/api/country-of-residences`);
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
  getCaseApiUrl,
  fetchCountryOfResidences,
  getCountryOfResidences,
  setCountryOfResidences
};