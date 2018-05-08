/* eslint-disable no-unused-vars */
/* eslint-disable id-blacklist */
import datePicker from './bootstrap-datepicker1.8.0.min';
import $ from 'jquery';
import moment from 'moment/moment';
import { differenceWith, find, flatten, head, includes, indexOf, isEqual, last } from 'lodash';

const dp = {

  init: () => {
    dp.getBankHolidays(bankholidays => {
      dp.buildDatePicker(bankholidays);
    });
  },

  getBankHolidays: callback => {
    $.ajax({
      type: 'GET',
      url: 'https://www.gov.uk/bank-holidays.json',
      success: res => {
        const events = res['england-and-wales'].events;
        const dates = events.map(event => moment(event.date).format('MM-D-YYYY'));
        callback(dates);
      }
    });
  },

  buildDatePicker: datesDisabled => {
    dp.selector().datepicker({
      multidate: true,
      daysOfWeekDisabled: '0',
      startDate: '+4w',
      endDate: '+22w',
      weekStart: 1,
      maxViewMode: 0,
      datesDisabled,
      beforeShowDay: date => dp.displayFirstOfMonth(date)
    }).on('changeDate', event => {
      dp.changeDateHandler(event);
    });
    // Update the date-picker with dates that have already been added.
    dp.selector().datepicker('setDates', dp.getData().map(date => date.value));
  },

  selector: () => $('#date-picker'),

  changeDateHandler: event => {
    const dates = event.dates;

    if (dp.isDateAdded(dates)) {
      dp.postDate(dates);
    } else if (dp.isDateRemoved(dates)) {
      dp.removeDate(dates);
    } else {
      dp.displayDateList(dates);
    }
  },

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
  },

  sortDates: dates => dates.sort((date1, date2) => {
    if (date1.value > date2.value) return 1;
    if (date1.value < date2.value) return -1;
    return 0;
  }),

  displayDateList: dates => {
    const datesIndex = dates.map((date, index) => dp.buildDatesArray(index, date));
    const orderDates = dp.sortDates(datesIndex);
    let elements = '';

    orderDates.forEach(date => {
      elements += `<div id="add-another-list-items-${date.index}">
           <dd class="add-another-list-item">
             <span data-index="items-${date.index}">${dp.formatDateForDisplay(date.value)}</span>
           </dd>
           <dd class="add-another-list-controls">
              <a href="/dates-cant-attend/item-${date.index}/delete">Remove</a>
          </dd>
       </div>`;
    });
    if (elements === '') {
      const noItems = '<div><dd class="add-another-list-item">No dates added yet</dd></div>';
      $('.add-another-list').empty().append(noItems);
    } else {
      $('.add-another-list').empty().append(elements);
    }
  },

  postDate: dates => {
    const lastestDateAdded = last(dates);
    const mDate = moment(lastestDateAdded);
    const body = {
      'item.day': mDate.date().toString(),
      'item.month': (mDate.month() + 1).toString(),
      'item.year': mDate.year().toString()
    };
    const index = indexOf(dates, lastestDateAdded);

    $.ajax({
      type: 'POST',
      url: `/dates-cant-attend/item-${index}`,
      data: body,
      success: () => {
        dp.displayDateList(dates);
      }
    });
  },

  removeDate: dates => {
    const data = dp.getData();
    const oldDates = data.map(date => date.value);
    const newDates = dates;
    const dateToRemove = differenceWith(oldDates, newDates, isEqual).toString();
    const index = dp.getIndexFromDate(data, dateToRemove);

    $.ajax({
      type: 'GET',
      url: `/dates-cant-attend/item-${index}/delete`,
      success: () => {
        dp.displayDateList(newDates);
      }
    });
  },

  getIndexFromDate: (data, date) => find(data, { value: new Date(date) }).index,

  getIndexOfDate: element => $(element).data('index').split('-').pop(),

  getValueOfDate: element => new Date($(element).text()),

  buildDatesArray: (index, value) => {
    return {
      index,
      value
    };
  },

  getData: () => {
    const list = $('.add-another-list .add-another-list-item > span').toArray();
    return list.map(item => dp.buildDatesArray(dp.getIndexOfDate(item), dp.getValueOfDate(item)));
  },

  formatDateForDisplay: d => {
    const date = moment(new Date(d));
    return date.format('dddd D MMMM YYYY');
  },

  isDateAdded: newDateList => {
    const currentDateList = dp.getData();
    return newDateList.length > currentDateList.length;
  },

  isDateRemoved: newDateList => {
    const currentDateList = dp.getData();
    return currentDateList.length > newDateList.length;
  }

};

module.exports = dp;
