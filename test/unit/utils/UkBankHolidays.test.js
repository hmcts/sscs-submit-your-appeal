const { expect } = require('chai');
const sinon = require('sinon');
const moment = require('moment');
const UkBankHolidays = require('utils/UkBankHolidays');
const config = require('config');

describe('UkBankHolidays Utility', () => {
  let ukBankHolidays = null;
  let fetchStub = null;

  const mockBankHolidayData = {
    'england-and-wales': {
      division: 'england-and-wales',
      events: [
        {
          title: 'New Year’s Day',
          date: '2026-01-01',
          notes: '',
          bunting: true
        },
        {
          title: 'Christmas Day',
          date: '2026-12-25',
          notes: '',
          bunting: true
        }
      ]
    },
    scotland: {
      division: 'scotland',
      events: [
        {
          title: 'St Andrew’s Day',
          date: '2026-11-30',
          notes: '',
          bunting: true
        }
      ]
    }
  };

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch');
    UkBankHolidays.resetCache();
    ukBankHolidays = new UkBankHolidays(['england-and-wales']);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should load bank holidays from the API', async() => {
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve(mockBankHolidayData)
    });

    await ukBankHolidays.load();

    expect(fetchStub.calledOnce).to.be.true;
    expect(fetchStub.calledWith(config.get('api.bankHolidaysUrl'))).to.be.true;
  });

  it('should correctly identify a bank holiday from a DD-MM-YYYY string', async() => {
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve(mockBankHolidayData)
    });
    await ukBankHolidays.load();
    const result = ukBankHolidays.isDateABankHoliday('01-01-2026');
    expect(result).to.be.true;
  });

  it('should return false for a non-bank holiday', async() => {
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve(mockBankHolidayData)
    });
    await ukBankHolidays.load();
    const result = ukBankHolidays.isDateABankHoliday('02-01-2026');
    expect(result).to.be.false;
  });

  it('should correctly identify a bank holiday from a Moment object', async() => {
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve(mockBankHolidayData)
    });
    await ukBankHolidays.load();
    const date = moment('2026-12-25');
    const result = ukBankHolidays.isDateABankHoliday(date);
    expect(result).to.be.true;
  });

  it('should respect the "division" (country) setting', async() => {
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve(mockBankHolidayData)
    });

    await ukBankHolidays.load();
    expect(ukBankHolidays.isDateABankHoliday('30-11-2026')).to.be.false;

    const scotlandHolidays = new UkBankHolidays(['scotland']);
    expect(scotlandHolidays.isDateABankHoliday('30-11-2026')).to.be.true;
  });

  it('should use cached data on subsequent calls (fetch called only once)', async() => {
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve(mockBankHolidayData)
    });
    await ukBankHolidays.load();

    const secondInstance = new UkBankHolidays(['england-and-wales']);
    await secondInstance.load();

    expect(fetchStub.calledOnce).to.be.true;
  });

  it('should handle API errors gracefully', async() => {
    fetchStub.resolves({ ok: false, statusText: 'Not Found' });
    await ukBankHolidays.load();

    expect(ukBankHolidays.isDateABankHoliday('01-01-2026')).to.be.false;
  });
});
