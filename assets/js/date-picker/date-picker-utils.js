const $ = require('jquery');
const moment = require('moment');
const { find } = require('lodash');

const datePickerUtils = {

  getIndexFromDate: (dateList, date) => find(dateList, { value: new Date(date) }).index,

  getIndexOfDate: element => $(element).data('index').split('-').pop(),

  getValueOfDate: element => new Date($(element).text()),

  buildDatesArray: (index, value) => {
    return {
      index,
      value
    };
  },

  formatDateForDisplay: d => {
    const date = moment(new Date(d));
    return date.format('dddd D MMMM YYYY');
  },

  isDateAdded: (currentDateList, newDateList) => newDateList.length > currentDateList.length,

  isDateRemoved: (currentDateList, newDateList) => currentDateList.length > newDateList.length,

  sortDates: dates => dates.sort((date1, date2) => {
    if (date1.value > date2.value) return 1;
    if (date1.value < date2.value) return -1;
    return 0;
  }),

  displayFirstOfMonth: date => {
    const mDate = moment(date);
    const day = mDate.format('D');
    const month = mDate.format('MMM');
    const displayMonth = {};
    if (day === '1') {
      const html = `${day} <p class="first-of-month">${month}</p>`;
      displayMonth.content = html;
    }
    return displayMonth;
  }

};

module.exports = datePickerUtils;
