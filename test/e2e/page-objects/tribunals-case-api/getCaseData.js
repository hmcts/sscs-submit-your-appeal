const config = require('config');

const tribunalsApiUrl = config.get('api.url');
const authCookie = '__auth-token';

function checkTribunalAPIResponse(res) {
  if (res && res.status === 200) {
    if (res.data) {
      return res.data;
    }
    throw Error('Invalid API Response no data returned');
  } else {
    const status = res && res.status ? res.status : 'null';
    throw Error(`HTTP Error ${status} is invalid`);
  }
}

async function getMYACaseData(I, ccdCaseID) {
  const res = await I.sendGetRequest(`${tribunalsApiUrl}/appeals?caseId=${ccdCaseID}`);
  const caseData = checkTribunalAPIResponse(res);
  if (caseData.appeal) {
    return caseData.appeal;
  }
  throw Error('Invalid API Response appeal is missing from returned data');
}

async function getCaseData(I, ccdCaseID) {
  const myaCaseData = await I.getMYACaseData(I, ccdCaseID);
  if (!myaCaseData || !myaCaseData.appealNumber) {
    throw Error('Invalid Appeal Number)');
  }
  const tyaID = myaCaseData.appealNumber;
  const authTokenCookie = await I.grabCookie(authCookie);
  const headers = { Authorization: `Bearer ${authTokenCookie.value}` };
  const res = await I.sendGetRequest(`${tribunalsApiUrl}/api/citizen/${tyaID}`, headers);

  return checkTribunalAPIResponse(res);
}

module.exports = { checkTribunalAPIResponse, getMYACaseData, getCaseData };
