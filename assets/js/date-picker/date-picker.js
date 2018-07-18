/* eslint-disable no-unused-vars */
/* eslint-disable id-blacklist */
import bootstrapDatepicker from './bootstrap-datepicker1.8.0.min';
import $ from 'jquery';
import moment from 'moment/moment';
import { differenceWith, indexOf, isEqual, last } from 'lodash';
import datePickerUtils from './date-picker-utils';
const four = 4;

const datePicker = {

  init: () => {
    datePicker.getBankHolidays(bankholidays => {
      datePicker.buildDatePicker(bankholidays);
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
  hijackTabIndex: () => {
    /* eslint-disable no-invalid-this */
    $('.prev').attr('tabindex', 0);
    $('.datepicker-switch').attr('tabindex', 0);
    $('.next').attr('tabindex', 0);
    $('.dow').each(function tabIndexOnWeekDays() {
      $(this).attr('tabindex', 0);
    });
    $('.day:not(".disabled")').each(function addTabIndex() {
      $(this).attr('tabindex', 0);
    });
    /* eslint-enable no-invalid-this */
  },
  addAriaAttributes: () => {
    $('tfoot').remove();
    /* eslint-disable no-invalid-this */
    $('.dow').each(function tabIndexOnWeekDays(index) {
      const content = $(this).text();
      $(this).html(`<div aria-label="${[
        'Monday', 'Tuesday',
        'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ][index]}">${content}</div>`);
    });
    $('.prev').attr('role', 'button').attr('aria-label', 'previous month');
    $('.next').attr('role', 'button').attr('aria-label', 'next month');
    $('.day:not(".disabled")').each(function addAriaRole() {
      if (!$(this).children('div').length) {
        const attrib = parseInt($(this).attr('data-date'), 10);
        const content = $(this).html();
        $(this).attr('role', 'button');
        $(this).html(`
        <div aria-label="${moment(attrib).format('dddd DD MMMM YYYY')}
      ${$(this).hasClass('active') ? ' selected' : ' deselected'}">${content}</div>`);
      }
    });
    /* eslint-enable no-invalid-this */
  },
  addAccessibilityFeatures: () => {
    datePicker.hijackTabIndex();
    datePicker.addAriaAttributes();
  },
  enableKeyActions: () => {
    const enterKey = 13;
    const leftArrowKey = 37;
    const upArrowKey = 38;
    const rightArrowKey = 39;
    const downArrowKey = 40;
    /* eslint-disable consistent-return */
    datePicker.selector().on('keydown', event => {
      const index = $(document.activeElement)
        .closest('tr').children().index($(document.activeElement));
      switch (event.keyCode) {
      case enterKey:
        // Why this? Because the synthetic event triggered by
        // datePicker.selector().datepicker('setDate',
        // document.activeElement.getAttribute('data-date'));
        // doesn't contain the same set of information contained in the dom-generated event.
        $(document.activeElement).trigger('click');
        break;
      case leftArrowKey:
        $(document.activeElement).prev('td').focus();
        break;
      case rightArrowKey:
        $(document.activeElement).next('td').focus();
        break;
      case upArrowKey:
        event.preventDefault();
        $(document.activeElement).closest('tr').prev().find(`td:eq(${index})`).focus();
        break;
      case downArrowKey:
        event.preventDefault();
        $(document.activeElement).closest('tr').next().find(`td:eq(${index})`).focus();
        break;
      default:
        return true;
      }
    });
    /* eslint-enable consistent-return */
  },
  buildDatePicker: datesDisabled => {
    datePicker.selector().datepicker({
      multidate: true,
      daysOfWeekDisabled: '06',
      defaultViewDate: moment().add(four, 'weeks').format('MM-D-YYYY'),
      startDate: '+4w',
      endDate: '+22w',
      weekStart: 1,
      maxViewMode: 0,
      datesDisabled,
      templates: {
        leftArrow: datePicker.toggleArrows('previous'),
        rightArrow: datePicker.toggleArrows('next')
      },
      beforeShowDay: date => datePickerUtils.displayFirstOfMonth(date)
    }).on('changeDate', event => datePicker.changeDateHandler(event));
    datePicker.setUpDOWHeading();
    // Update the date-picker with dates that have already been added.
    datePicker.selector().datepicker('setDates', datePicker.getData().map(date => date.value));
    datePicker.selector().off('keydown');
    datePicker.enableKeyActions();
    $('.prev, .next').on('click', event => {
      if ($(event.target).hasClass('prev') || $(event.target).hasClass('next')) {
        window.setTimeout(datePicker.addAccessibilityFeatures, 0);
      }
    });
    window.setTimeout(datePicker.addAccessibilityFeatures, 0);
  },

  selector: () => $('#date-picker'),

  toggleArrows: nextOrPrevArrow => {
    const assetPath = $('#asset-path').data('path');
    return `<img 
                src="${assetPath}images/${nextOrPrevArrow}_arrow.png" 
                alt="${nextOrPrevArrow} month"
            >`;
  },

  setUpDOWHeading: () => {
    const days = [
      'MON',
      'TUE',
      'WED',
      'THU',
      'FRI',
      'SAT',
      'SUN'
    ];
    const dow = $('.dow');
    $.each(dow, function changeText(index) {
      // eslint-disable-next-line no-invalid-this
      $(this).text(days[index]);
    });
  },

  updateAriaAttributesOnSelect: cell => {
    window.setTimeout(() => {
      cell.focus();
    }, 0);
  },

  changeDateHandler: event => {
    const dates = event.dates;
    datePicker.addAccessibilityFeatures();
    const currentDates = datePicker.getData();
    const added = datePickerUtils.isDateAdded(currentDates, dates);
    const removed = datePickerUtils.isDateRemoved(currentDates, dates);
    if (added) {
      const selected = datePickerUtils.findCellByTimestamp(last(dates));
      datePicker.updateAriaAttributesOnSelect(selected);
      return datePicker.postDate(dates);
    } else if (removed) {
      const deselected = differenceWith(currentDates.map(value => value.value), dates, isEqual);
      const deselectedCell = datePickerUtils.findCellByTimestamp(deselected[0]);
      datePicker.updateAriaAttributesOnSelect(deselectedCell);
      return datePicker.removeDate(dates);
    }
    return datePicker.displayDateList(dates);
  },

  displayDateList: dates => {
    const datesIndex = dates.map((date, index) => datePickerUtils.buildDatesArray(index, date));
    const orderDates = datePickerUtils.sortDates(datesIndex);
    let elements = '';

    $.each(orderDates, (index, date) => {
      elements += `
        <dt class="visually-hidden">items-${date.index}</dt>
        <dd id="add-another-list-items-${date.index}" class="add-another-list-item">
          <span data-index="items-${date.index}">
            ${datePickerUtils.formatDateForDisplay(date.value)}
          </span>
        </dd>
        <dd class="add-another-list-controls">
          <a href="/dates-cant-attend/item-${date.index}/delete">Remove</a>
        </dd>`;
    });
    if (elements === '') {
      const noItems = `<dt class="visually-hidden">No items</dt>
        <dd class="add-another-list-item  noItems">No dates added yet</dd>`;
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

    return $.ajax({
      type: 'POST',
      url: `/dates-cant-attend/item-${index}`,
      data: body,
      success: () => datePicker.displayDateList(dates)
    });
  },

  removeDate: dates => {
    const data = datePicker.getData();
    const oldDates = data.map(date => date.value);
    const newDates = dates;
    const dateToRemove = differenceWith(oldDates, newDates, isEqual).toString();
    const index = datePickerUtils.getIndexFromDate(data, dateToRemove);

    return $.ajax({
      type: 'GET',
      url: `/dates-cant-attend/item-${index}/delete`,
      success: () => datePicker.displayDateList(newDates)
    });
  },

  getData: () => {
    const list = $('.add-another-list .add-another-list-item > span').toArray();
    return list.map(item => datePickerUtils.buildDatesArray(
      datePickerUtils.getIndexOfDate(item),
      datePickerUtils.getValueOfDate(item)
    ));
  }

};

module.exports = datePicker;
