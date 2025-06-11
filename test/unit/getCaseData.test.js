const { expect } = require('test/util/chai');
const GetCaseData = require('../e2e/page-objects/tribunals-case-api/getCaseData.js');

describe('getCaseData E2E function', () => {
  const ccdCaseID = '1641472310079136';
  let apiResponse = {};
  let responseObject = {};
  let request = {};
  let browserContext = {};
  let browser = {};

  beforeEach(() => {
    apiResponse = {};
    responseObject = {
      ok: () => true,
      json: () => apiResponse,
      status: () => 200
    };

    request = {
      get: () => responseObject
    };

    browserContext = {
      cookies: () => [{ name: '__auth-token', value: '00000000000000000000' }]
    };
    browser = {
      contexts: () => [browserContext]
    };
  });

  describe('checkTribunalAPIResponse', () => {
    it("should return the response's data structure if response is ok", async () => {
      apiResponse = { appeal: {} };
      const result = await GetCaseData.checkTribunalAPIResponse(responseObject);
      expect(result).to.equal(apiResponse);
    });

    it('should throw an error if response is not ok', async () => {
      responseObject = {
        json: () => apiResponse,
        ok: () => false,
        status: () => 404
      };
      await expect(
        GetCaseData.checkTribunalAPIResponse(responseObject)
      ).to.be.rejectedWith('HTTP Error 404 is invalid');
    });

    it('should throw an error if response is null', async () => {
      await expect(
        GetCaseData.checkTribunalAPIResponse(null)
      ).to.be.rejectedWith('HTTP Error null is invalid');
    });
  });

  describe('getMYACaseData', () => {
    it('should return the correct response when the structure is correct', async () => {
      apiResponse = { appeal: { appealNumber: 'bVLwEI7OQY' } };
      const result = await GetCaseData.getMYACaseData(request, ccdCaseID);
      expect(result).to.equal(apiResponse.appeal);
    });

    it('should throw an error if appeal is missing from returned data', async () => {
      apiResponse = {};
      responseObject = {
        json: () => apiResponse,
        ok: () => true,
        status: () => 200
      };
      await expect(
        GetCaseData.getMYACaseData(request, ccdCaseID)
      ).to.be.rejectedWith(
        'Invalid API Response appeal is missing from returned data'
      );
    });
  });

  describe('getCaseData', () => {
    it('should return the correct response when the structure is correct', async () => {
      apiResponse = {
        appeal: { state: 'validAppeal', appealNumber: ccdCaseID }
      };
      const result = await GetCaseData.getCaseData(browser, request, ccdCaseID);
      expect(result).to.equal(apiResponse);
    });

    it('should throw an error if appeal number is invalid', async () => {
      apiResponse = { appeal: { state: 'validAppeal', appealNumber: null } };
      await expect(
        GetCaseData.getCaseData(browser, request, ccdCaseID)
      ).to.be.rejectedWith('Invalid Appeal Number');
    });
  });
});
