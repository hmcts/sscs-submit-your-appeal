const config = require('config');

const tribunalsApiUrl = config.get('api.url');
const authCookie = '__auth-token';

async function getMYACaseData(commonContent, ccdCaseID) {
  const I = this;
  const res = await I.sendGetRequest(`${tribunalsApiUrl}/appeals?caseId=${ccdCaseID}`);

  if (res.status === 200) {
    if (res.data !== null && res.data.appeal !== null) {
      return res.data.appeal;
    }
    throw Error('Invalid API Response)');
  } else {
    throw Error(`HTTP Error ${res.status} not correct`);
  }
}

async function getCaseData(commonContent, ccdCaseID) {
  const I = this;
  const myaCaseData = await I.getMYACaseData(commonContent, ccdCaseID);
  const tyaID = myaCaseData.appealNumber;
  const authTokenCookie = await I.grabCookie(authCookie);
  const headers = { Authorization: `Bearer ${authTokenCookie.value}` };
  const res = await I.sendGetRequest(`${tribunalsApiUrl}/api/citizen/${tyaID}`, headers);

  if (res.status === 200) {
    if (res.data !== null) {
      return res.data;
    }
    throw Error('Invalid API Response)');
  } else {
    throw Error(`HTTP Error ${res.status} not correct`);
  }
}

module.exports = { getMYACaseData, getCaseData };
