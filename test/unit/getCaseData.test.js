/* eslint-disable id-blacklist */
const { expect } = require('test/util/chai');

const GetCaseData = require('../e2e/page-objects/tribunals-case-api/getCaseData.js');

describe('getCaseData E2E function', () => {
  const ccdCaseID = '1641472310079136';
  let apiResponse = {};
  let myaCaseResponse = {};
  const responseObject = {
    json: () => {
      return apiResponse;
    }
  };

  const request = {
    getMYACaseData: () => {
      return myaCaseResponse;
    },
    get: () => {
      return responseObject;
    }
  };

  const browserContext = {
    cookies: () => [{ name: '__auth-token', value: '00000000000000000000' }]
  };
  const browser = {
    contexts: () => {
      return [browserContext];
    }
  };

  describe('checkTribunalAPIResponse', () => {
    it('should return the response\'s data structure is correct', () => {
      apiResponse = {
        status: 200,
        data: {
          appeal: {}
        }
      };
      expect(GetCaseData.checkTribunalAPIResponse(apiResponse)).to.equal(apiResponse.data);
    });
    it('should return a HTTP 404 error if the resource is not found', () => {
      apiResponse = {
        status: 404
      };
      expect(() => GetCaseData.checkTribunalAPIResponse(apiResponse)).to.throw(`HTTP Error ${apiResponse.status} is invalid`);
    });
    it('should return a HTTP 500 error if there is a internal server error', () => {
      apiResponse = {
        status: 500
      };
      expect(() => GetCaseData.checkTribunalAPIResponse(apiResponse)).to.throw(`HTTP Error ${apiResponse.status} is invalid`);
    });
    it('should return a null error when there is a null response', () => {
      apiResponse = null;
      expect(() => GetCaseData.checkTribunalAPIResponse(apiResponse)).to.throw('HTTP Error null is invalid');
    });
    it('should return a invalid api response error when there is no data in the response', () => {
      apiResponse = {
        status: 200
      };
      expect(() => GetCaseData.checkTribunalAPIResponse(apiResponse)).to.throw('Invalid API Response no data returned');
    });
  });

  describe('getMYACaseData', () => {
    it('should generate and return the correct response when the structure is correct', async() => {
      apiResponse = {
        status: 200,
        data: {
          appeal: {
            appealNumber: 'bVLwEI7OQY'
          }
        }
      };
      const resMYACaseData = await GetCaseData.getMYACaseData(request, ccdCaseID);
      expect(apiResponse.data.appeal).to.equal(resMYACaseData);
    });

    it('should return a invalid api response error when there is no appealNumber in the response', () => {
      apiResponse = {
        status: 200,
        data: {}
      };
      expect(GetCaseData.getMYACaseData(request, ccdCaseID)).to.be.rejectedWith('Invalid API Response appeal is missing from returned data');
    });
  });
  describe('getCaseData', () => {
    it('should generate and return the correct response when the structure is correct', async() => {
      myaCaseResponse = { appealNumber: 'bVLwEI7OQY' };
      apiResponse = {
        status: 200,
        data: {
          appeal: {
            state: 'validAppeal',
            appealNumber: ccdCaseID
          }
        }
      };
      const resCaseData = await GetCaseData.getCaseData(browser, request, ccdCaseID);
      expect(apiResponse.data).to.equal(resCaseData);
    });
    it('should return a invalid appeal number error when the getMYACaseData response is empty', () => {
      myaCaseResponse = null;
      apiResponse = {
        status: 200,
        data: {
          appeal: {}
        }
      };
      expect(GetCaseData.getCaseData(browser, request, ccdCaseID)).to.be.rejectedWith('Invalid Appeal Number)');
    });
  });
});
