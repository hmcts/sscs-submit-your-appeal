/* eslint-disable global-require, no-process-env */
const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const {
  fetchPortOfEntries,
  getPortOfEntries,
  setPortOfEntries,
  getCountryOfResidences,
  fetchCountryOfResidences,
  setCountryOfResidences
} = require('utils/enumJsonLists');

describe('EnumJsonLists util', () => {
  let axiosGetStub = sinon.stub(axios, 'get');

  beforeEach(() => {
    axiosGetStub = sinon.stub(axios, 'get');
  });

  afterEach(() => {
    sinon.restore();
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
