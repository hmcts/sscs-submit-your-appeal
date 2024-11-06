/* eslint-disable global-require, no-process-env */
const { expect } = require('chai');
const sinon = require('sinon');
const superagent = require('superagent');
const {
  fetchPortsOfEntry,
  getPortsOfEntry,
  getCountriesOfResidence,
  fetchCountriesOfResidence
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
      const consoleErrorStub = sinon.stub(console, 'error');
      const consoleLogStub = sinon.stub(console, 'log');
      const error = new Error('Network error');
      superagentGetStub.rejects(error);

      await expect(fetchPortsOfEntry()).to.be.rejectedWith(error);

      expect(consoleErrorStub.calledWithMatch('Error requesting portOfEntry data from : ')).to.be.true;
      expect(consoleLogStub.calledWithMatch('Requesting from AAT...')).to.be.true;
      consoleErrorStub.restore();
      consoleLogStub.restore();
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
      const consoleErrorStub = sinon.stub(console, 'error');
      const consoleLogStub = sinon.stub(console, 'log');
      const error = new Error('Network error');
      superagentGetStub.rejects(error);

      await expect(fetchCountriesOfResidence()).to.be.rejectedWith(error);

      expect(consoleErrorStub.calledWithMatch('Error requesting countriesOfResidence data from : ')).to.be.true;
      expect(consoleLogStub.calledWithMatch('Requesting from AAT...')).to.be.true;
      consoleErrorStub.restore();
      consoleLogStub.restore();
    });
  });
});
