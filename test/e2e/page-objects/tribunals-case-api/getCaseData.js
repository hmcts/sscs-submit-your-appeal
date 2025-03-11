/* eslint-disable no-return-await */
const config = require('config');

const tribunalsApiUrl = config.get('api.url');
const authCookie = '__auth-token';

async function checkTribunalAPIResponse(response) {
  if (response && response.ok()) {
    return await response.json();
  }
  const status = response && response.status() ? response.status() : 'null';
  throw Error(`HTTP Error ${status} is invalid`);
}

async function getMYACaseData(request, ccdCaseID) {
  const response = await request.get(
    `${tribunalsApiUrl}/appeals?caseId=${ccdCaseID}`
  );
  const caseData = await checkTribunalAPIResponse(response);
  if (caseData.appeal) {
    return caseData.appeal;
  }
  throw Error('Invalid API Response appeal is missing from returned data');
}

async function getCaseData(browser, request, ccdCaseID) {
  const myaCaseData = await getMYACaseData(request, ccdCaseID);
  if (!myaCaseData || !myaCaseData.appealNumber) {
    throw Error('Invalid Appeal Number)');
  }
  const tyaID = myaCaseData.appealNumber;
  const cookies = await browser.contexts()[0].cookies();
  const authTokenCookie = (cookies.filter(
    cookie => cookie.name === authCookie
  ) || [''])[0];
  const headers = { Authorization: `Bearer ${authTokenCookie.value}` };
  const response = await request.get(
    `${tribunalsApiUrl}/api/citizen/${tyaID}`,
    { headers }
  );
  return await checkTribunalAPIResponse(response);
}

module.exports = { checkTribunalAPIResponse, getMYACaseData, getCaseData };
