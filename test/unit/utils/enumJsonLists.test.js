/* eslint-disable global-require, no-process-env */
const { expect } = require('chai');
const sinon = require('sinon');
const superagent = require('superagent');
const {
  fetchPortsOfEntry,
  getPortsOfEntry,
  setPortsOfEntry,
  getCountriesOfResidence,
  fetchCountriesOfResidence,
  setCountriesOfResidence
} = require('utils/enumJsonLists');

describe('EnumJsonLists util', () => {
  let superagentGetStub = null;

  beforeEach(() => {
    superagentGetStub = sinon.stub(superagent, 'get');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('fetchPortsOfEntry', () => {
    it('should fetch and set portsOfEntry data correctly', async() => {
      // eslint-disable-next-line id-blacklist
      const mockResponse = { body: [{ label: 'Entry1', locationCode: 'locationCode1' }, { label: 'Entry2', locationCode: 'locationCode2' }], status: 200 };
      superagentGetStub.resolves(mockResponse);

      await fetchPortsOfEntry();

      const entries = getPortsOfEntry();
      expect(entries).to.deep.equal([
        { label: 'Entry1', value: 'locationCode1', locationCode: 'locationCode1' },
        { label: 'Entry2', value: 'locationCode2', locationCode: 'locationCode2' }
      ]);
    });

    it('should handle errors when fetching portsOfEntry data', async() => {
      const consoleStub = sinon.stub(console, 'error');
      superagentGetStub.rejects(new Error('Network error'));

      await fetchPortsOfEntry();

      expect(consoleStub.calledWithMatch('Error fetching portOfEntry data:')).to.be.true;
      consoleStub.restore();
    });
  });

  describe('setPortsOfEntry and getPortsOfEntry', () => {
    it('should set and get portsOfEntry data correctly', () => {
      const testEntries = [{ label: 'TestEntry1', value: 'TestValue1' }];

      setPortsOfEntry(testEntries);
      const entries = getPortsOfEntry();

      expect(entries).to.deep.equal(testEntries);
    });
  });

  describe('fetchCountriesOfResidence', () => {
    it('should fetch and set countriesOfResidence data correctly', async() => {
      // eslint-disable-next-line id-blacklist
      const mockResponse = { body: [{ label: 'Entry1' }, { label: 'Entry2' }], status: 200 };
      superagentGetStub.resolves(mockResponse);

      await fetchCountriesOfResidence();

      const entries = getCountriesOfResidence();
      expect(entries).to.deep.equal([
        { label: 'Entry1', value: 'Entry1' },
        { label: 'Entry2', value: 'Entry2' }
      ]);
    });

    it('should handle errors when fetching fetchCountriesOfResidence data', async() => {
      const consoleStub = sinon.stub(console, 'error');
      superagentGetStub.rejects(new Error('Network error'));

      await fetchCountriesOfResidence();

      expect(consoleStub.calledWithMatch('Error fetching countriesOfResidence data:')).to.be.true;
      consoleStub.restore();
    });
  });

  describe('setCountriesOfResidence and getCountriesOfResidence', () => {
    it('should set and get countriesOfResidence data correctly', () => {
      const testEntries = [{ label: 'TestEntry1', value: 'TestEntry1' }];

      setCountriesOfResidence(testEntries);
      const entries = getCountriesOfResidence();

      expect(entries).to.deep.equal(testEntries);
    });
  });
});
