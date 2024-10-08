/* eslint-disable global-require, no-process-env */
const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const { fetchPortOfEntries, getPortOfEntries, setPortOfEntries } = require('utils/enumJsonLists');
const { getCountryOfResidences, fetchCountryOfResidences } = require('utils/enumJsonLists');
const { setCountryOfResidences } = require('../../../utils/enumJsonLists');

describe('EnumJsonLists util', () => {
  let axiosGetStub = sinon.stub(axios, 'get');

  beforeEach(() => {
    axiosGetStub = sinon.stub(axios, 'get');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getCaseApiUrl', () => {
    it('should return default URL when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;
      delete process.env.TRIBUNALS_CASE_API_URL;
      const { getCaseApiUrl } = require('utils/enumJsonLists');

      expect(getCaseApiUrl()).to.equal('http://sscs-tribunals-api-aat.service.core-compute-aat.internal');
    });

    it("should return production URL when NODE_ENV is 'prod'", () => {
      process.env.NODE_ENV = 'prod';
      const { getCaseApiUrl } = require('utils/enumJsonLists');

      expect(getCaseApiUrl()).to.equal('prod-url');
    });

    it("should return development URL when NODE_ENV is 'development'", () => {
      process.env.NODE_ENV = 'development';
      const { getCaseApiUrl } = require('utils/enumJsonLists');

      expect(getCaseApiUrl()).to.equal('http://localhost:8008');
    });

    it('should return custom URL when TRIBUNALS_CASE_API_URL is set', () => {
      process.env.NODE_ENV = 'test';
      process.env.TRIBUNALS_CASE_API_URL = 'http://custom-url.com';
      const { getCaseApiUrl } = require('utils/enumJsonLists');

      expect(getCaseApiUrl()).to.equal('http://custom-url.com');
    });
  });

  describe('fetchPortOfEntries', () => {
    it('should fetch and set portOfEntries data correctly', async() => {
      // eslint-disable-next-line id-blacklist
      const mockResponse = { data: [{ label: 'Entry1' }, { label: 'Entry2' }] };
      axiosGetStub.resolves(mockResponse);

      await fetchPortOfEntries();

      const entries = getPortOfEntries();
      expect(entries).to.deep.equal([
        { label: 'Entry1', value: 'Entry1' },
        { label: 'Entry2', value: 'Entry2' }
      ]);
    });

    it('should handle errors when fetching portOfEntries data', async() => {
      const consoleStub = sinon.stub(console, 'log');
      axiosGetStub.rejects(new Error('Network error'));

      await fetchPortOfEntries();

      expect(consoleStub.calledWithMatch('Error fetching portOfEntry data:')).to.be.true;
      consoleStub.restore();
    });
  });

  describe('setPortOfEntries and getPortOfEntries', () => {
    it('should set and get portOfEntries data correctly', () => {
      const testEntries = [{ label: 'TestEntry1', value: 'TestEntry1' }];

      setPortOfEntries(testEntries);
      const entries = getPortOfEntries();

      expect(entries).to.deep.equal(testEntries);
    });
  });

  describe('fetchCountryOfResidences', () => {
    it('should fetch and set countryOfResidences data correctly', async() => {
      // eslint-disable-next-line id-blacklist
      const mockResponse = { data: [{ label: 'Entry1' }, { label: 'Entry2' }] };
      axiosGetStub.resolves(mockResponse);

      await fetchCountryOfResidences();

      const entries = getCountryOfResidences();
      expect(entries).to.deep.equal([
        { label: 'Entry1', value: 'Entry1' },
        { label: 'Entry2', value: 'Entry2' }
      ]);
    });

    it('should handle errors when fetching fetchCountryOfResidences data', async() => {
      const consoleStub = sinon.stub(console, 'log');
      axiosGetStub.rejects(new Error('Network error'));

      await fetchCountryOfResidences();

      expect(consoleStub.calledWithMatch('Error fetching countryOfResidences data:')).to.be.true;
      consoleStub.restore();
    });
  });

  describe('setCountryOfResidences and getCountryOfResidences', () => {
    it('should set and get countryOfResidences data correctly', () => {
      const testEntries = [{ label: 'TestEntry1', value: 'TestEntry1' }];

      setCountryOfResidences(testEntries);
      const entries = getCountryOfResidences();

      expect(entries).to.deep.equal(testEntries);
    });
  });
});
