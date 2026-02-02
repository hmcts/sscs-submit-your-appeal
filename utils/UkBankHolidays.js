const moment = require('moment');
const logger = require('logger');

let bankHolidaysCache = null;
let lastFetchTime = 0;
/* eslint-disable no-magic-numbers */
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const GOV_UK_URL = 'https://www.gov.uk/bank-holidays.json';

class UkBankHolidays {
  constructor(divisions) {
    this.divisions = divisions;
  }

  async load() {
    if (this.isCacheValid()) {
      return;
    }

    try {
      const response = await fetch(GOV_UK_URL);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch bank holidays: ${response.statusText}`
        );
      }
      bankHolidaysCache = await response.json();
      lastFetchTime = Date.now();
    } catch (error) {
      logger.exception('Error loading UK Bank Holidays:', error);
    }
  }

  isDateABankHoliday(date) {
    if (!bankHolidaysCache) {
      logger.exception('UkBankHolidays: Data not loaded.');
      return false;
    }

    let searchDate = null;

    if (moment.isMoment(date)) {
      searchDate = date.format('YYYY-MM-DD');
    } else if (typeof date === 'string') {
      // Handle DD-MM-YYYY specifically
      if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        searchDate = date.split('-').reverse().join('-');
      } else {
        // Fallback if the date is already YYYY-MM-DD or invalid
        searchDate = date;
      }
    } else {
      return false;
    }

    return this.divisions.some(division => {
      const divisionData = bankHolidaysCache[division];
      if (!divisionData) return false;
      return divisionData.events.some(event => event.date === searchDate);
    });
  }

  isCacheValid() {
    return bankHolidaysCache !== null && Date.now() - lastFetchTime < ONE_WEEK;
  }

  static resetCache() {
    bankHolidaysCache = null;
    lastFetchTime = 0;
  }
}

module.exports = UkBankHolidays;
