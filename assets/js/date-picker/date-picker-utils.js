import * as $ from 'jquery';
import moment from 'moment';
import { find } from 'lodash-es';

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
    const fullMonth = mDate.format('MMMM');
    const displayMonth = {
      content: `<span>${day}</span>`
    };
    if (day === '1') {
      // eslint-disable-next-line max-len
      const html = `<span>${day}</span><p class="govuk-body first-of-month" aria-label="${fullMonth}">${month}</p>`;
      displayMonth.content = html;
    }
    return displayMonth;
  },

  findCellByTimestamp: date => {
    const timestamp = parseInt(moment.utc(date).format('x'));
    const bstOffset = 3600000;
    return $(`td[data-date="${timestamp}"]`).length ?
      $(`td[data-date="${timestamp}"]`) :
      $(`td[data-date="${timestamp + bstOffset}"]`);
  }

};

export default datePickerUtils;
