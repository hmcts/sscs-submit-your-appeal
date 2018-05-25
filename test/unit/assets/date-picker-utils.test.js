const { expect } = require('test/util/chai');
const datePickerUtils = require('assets/js/date-picker/date-picker-utils');

describe.only('date-picker-utils.js', () => {

  describe('buildDatesArray()', () => {

    it('returns an object with the index and value', () => {
      const dateArray = datePickerUtils.buildDatesArray('1', '24-12-2018');
      expect(dateArray).to.eql({
        index: '1',
        value: '24-12-2018'
      });
    });

  });

  describe('getIndexFromDate()', () => {

    it('returns the index from the list of dates', () => {
      const data = [{
        index: '1',
        value: new Date()
      }, {
        index: '2',
        value: new Date('2018-12-24')
      }];
      const index = datePickerUtils.getIndexFromDate(data, new Date());
      expect(index).to.equal(data[0].index);
    });

  });

  describe('formatDateForDisplay()', () => {

    it('returns a formatted date', () => {
      const formattedDate = datePickerUtils.formatDateForDisplay('2018-12-24');
      expect(formattedDate).to.equal('Monday 24 December 2018')
    });

  });

  describe('isDateAdded()', () => {

    let currentDateList;

    before(() => {
      currentDateList = [
        '2018-12-24'
      ];
    });

    it('returns true when the newDateList is greater than the currentDateList', () => {
      const newDateList = currentDateList.slice(0);
      newDateList.push('2018-12-25');
      const dateAdded = datePickerUtils.isDateAdded(currentDateList, newDateList);
      expect(dateAdded).to.equal(true);
    });

    it('returns false when the newDateList is less than the currentDateList', () => {
      const newDateList = [];
      const dateAdded = datePickerUtils.isDateAdded(currentDateList, newDateList);
      expect(dateAdded).to.equal(false);
    });

  });

  describe('isDateRemoved()', () => {

    let currentDateList;

    before(() => {
      currentDateList = [
        '2018-12-24'
      ];
    });

    it('returns false when the newDateList is less than the currentDateList', () => {
      const newDateList = currentDateList.slice(0);
      newDateList.push('2018-12-25');
      const dateRemoved = datePickerUtils.isDateRemoved(currentDateList, newDateList);
      expect(dateRemoved).to.equal(false);
    });

    it('returns true when the newDateList is greater than the currentDateList', () => {
      const newDateList = [];
      const dateRemoved = datePickerUtils.isDateRemoved(currentDateList, newDateList);
      expect(dateRemoved).to.equal(true);
    });

  });

  describe('sortDates()', () => {

    it('returns the array of dates in order', () => {
      const datesOutOfOrder = [{
        value: new Date('2018-12-25')
      }, {
        value: new Date('2017-08-30')
      }, {
        value: new Date('2018-02-03')
      }];
      const datesInOrder = [{
        value: new Date('2017-08-30')
      }, {
        value: new Date('2018-02-03')
      }, {
        value: new Date('2018-12-25')
      }];
      const dates = datePickerUtils.sortDates(datesOutOfOrder);
      expect(dates).to.eql(datesInOrder);
    });

  });

  describe('sortDates()', () => {

    it('returns the array of dates in order', () => {
      const datesOutOfOrder = [{
        value: new Date('2018-12-25')
      }, {
        value: new Date('2017-08-30')
      }, {
        value: new Date('2018-02-03')
      }];
      const datesInOrder = [{
        value: new Date('2017-08-30')
      }, {
        value: new Date('2018-02-03')
      }, {
        value: new Date('2018-12-25')
      }];
      const dates = datePickerUtils.sortDates(datesOutOfOrder);
      expect(dates).to.eql(datesInOrder);
    });

  });

  describe('displayFirstOfMonth()', () => {

    it('returns empty object when the day is not the first of the month', () => {
      const displayMonth = datePickerUtils.displayFirstOfMonth(new Date('2018-12-25'));
      expect(displayMonth).to.eql({});
    });

    it('returns an object with html string when the day is  the first of the month', () => {
      const displayMonth = datePickerUtils.displayFirstOfMonth(new Date('2018-12-01'));
      expect(displayMonth).to.eql({
        content: '1 <p class="first-of-month">Dec</p>'
      });
    });

  });

});
