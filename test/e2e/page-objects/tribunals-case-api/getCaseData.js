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
    const status = res ? res.status : 'null';
    throw Error(`HTTP Error ${status} is invalid`);
  }
}

async function getMYACaseData(page, ccdCaseID) {
  const res = await page.request.get(`${tribunalsApiUrl}/appeals?caseId=${ccdCaseID}`);
  const caseData = checkTribunalAPIResponse(res);
  if (caseData.appeal) {
    return caseData.appeal;
  }
  throw Error('Invalid API Response appeal is missing from returned data');
}

async function getCaseData(page, ccdCaseID) {
  const myaCaseData = await getMYACaseData(page, ccdCaseID);
  const tyaID = myaCaseData.appealNumber;
  const cookies = await page.context().cookies();
  const authTokenCookie = cookies.find(cookie => cookie.name === authCookie);
  if (!authTokenCookie) {
    throw new Error('Auth cookie not found');
  }
  const headers = { Authorization: `Bearer ${authTokenCookie.value}` };
  const res = await page.request.get(`${tribunalsApiUrl}/api/citizen/${tyaID}`, { headers });

  return checkTribunalAPIResponse(res);
}

module.exports = { checkTribunalAPIResponse, getMYACaseData, getCaseData };
