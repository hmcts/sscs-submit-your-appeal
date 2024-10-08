const axios = require('axios');

let portOfEntries = null;
let countryOfResidences = null;

const getCaseApiUrl = () => {
  let caseApiUrl = 'https://sscs-tribunals-api-aat.service.core-compute-aat.internal';
  if (process.env.NODE_ENV === 'prod') {
    caseApiUrl = 'prod-url';
  } else if (process.env.NODE_ENV === 'development') {
    caseApiUrl = 'http://localhost:8008';
  } else if ((process.env.TRIBUNALS_CASE_API_URL || null) !== null) {
    caseApiUrl = process.env.TRIBUNALS_CASE_API_URL;
  }
  console.log(caseApiUrl)
  return caseApiUrl;
};

async function fetchPortOfEntries() {
  try {
    const res = await axios.get(`${getCaseApiUrl()}/api/port-of-entries`);
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