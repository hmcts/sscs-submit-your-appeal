/* eslint-disable no-unused-vars,id-blacklist */
const { expect } = require('chai');
const { request, context } = require('@playwright/test');
const GetCaseData = require('../e2e/page-objects/tribunals-case-api/getCaseData.js');

describe('getCaseData function with Playwright', () => {
  const ccdCaseID = '1641472310079136';
  let apiResponse = {};
  let myaCaseResponse = {};
  let page = {};

  beforeEach(() => {
    // Mock the page context and cookies for Playwright
    page = {
      request: {
        get: url => {
          // Mock the GET request responses for specific URLs
          if (url.includes('appeals?caseId=')) {
            return { status: 200, data: myaCaseResponse };
          } else if (url.includes('/api/citizen/')) {
            return { status: 200, data: apiResponse };
          }
          return null;
        }
      },
      context: () => ({
        cookies: () => [{ name: '__auth-token', value: '00000000000000000000' }]
      })
    };
  });

  describe('checkTribunalAPIResponse', () => {
    it('should return the response data when structure is correct', () => {
      apiResponse = {
        status: 200,
        data: {
          appeal: {}
        }
      };
      expect(GetCaseData.checkTribunalAPIResponse(apiResponse)).to.equal(apiResponse.data);
    });

    it('should throw HTTP 404 error if resource is not found', () => {
      apiResponse = {
        status: 404
      };
      expect(() => GetCaseData.checkTribunalAPIResponse(apiResponse)).to.throw(`HTTP Error ${apiResponse.status} is invalid`);
    });

    it('should throw HTTP 500 error if there is an internal server error', () => {
      apiResponse = {
        status: 500
      };
      expect(() => GetCaseData.checkTribunalAPIResponse(apiResponse)).to.throw(`HTTP Error ${apiResponse.status} is invalid`);
    });

    it('should throw an error when the response is null', () => {
      apiResponse = null;
      expect(() => GetCaseData.checkTribunalAPIResponse(apiResponse)).to.throw('HTTP Error null is invalid');
    });

    it('should throw an error when there is no data in the response', () => {
      apiResponse = {
        status: 200
      };
      expect(() => GetCaseData.checkTribunalAPIResponse(apiResponse)).to.throw('Invalid API Response no data returned');
    });
  });

  describe('getMYACaseData', () => {
    it('should generate and return the correct response when the structure is correct', async() => {
      myaCaseResponse = {
        appeal: {
          appealNumber: 'bVLwEI7OQY'
        }
      };

      const resMYACaseData = await GetCaseData.getMYACaseData(page, ccdCaseID);
      expect(resMYACaseData).to.equal(myaCaseResponse.appeal);
    });

    it('should throw an error when there is no appealNumber in the response', async() => {
      myaCaseResponse = {
        data: {}
      };
      await expect(GetCaseData.getMYACaseData(page, ccdCaseID)).to.be.rejectedWith('Invalid API Response appeal is missing from returned data');
    });
  });

  describe('getCaseData', () => {
    it('should generate and return the correct response when the structure is correct', async() => {
      myaCaseResponse = { appeal: { appealNumber: 'bVLwEI7OQY' } };
      apiResponse = {
        status: 200,
        data: [
          {
            appeal_details: {
              state: 'validAppeal'
            }
          }
        ]
      };

      const resCaseData = await GetCaseData.getCaseData(page, ccdCaseID);
      expect(resCaseData).to.equal(apiResponse);
    });

    it('should throw an error when the getMYACaseData response is empty', async() => {
      myaCaseResponse = null;
      apiResponse = {
        status: 200
      };
      await expect(GetCaseData.getCaseData(page, ccdCaseID)).to.be.rejectedWith('Invalid API Response no data returned');
    });
  });
});
