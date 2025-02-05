/* eslint-disable max-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable id-blacklist */
import './bootstrap-datepicker1.9.0.min';
import * as $ from 'jquery';
import moment from 'moment/moment';
import { differenceWith, indexOf, isEqual, last } from 'lodash-es';
import datePickerUtils from './date-picker-utils';
const eight = 8;

const datePicker = {
  init: language => {
    datePicker.getBankHolidays(bankholidays => {
      datePicker.buildDatePicker(bankholidays, language);
    });
  },

  getBankHolidays: callback => {
    $.ajax({
      type: 'GET',
      url: 'https://www.gov.uk/bank-holidays.json',
      success: res => {
        const events = res['england-and-wales'].events;
        const dates = events.map(event =>
          moment(event.date).format('MM-D-YYYY')
        );
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

  addAriaAttributes: language => {
    let daysOfTheWeekArray = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
    let previousMonthString = 'previous month';
    let nextMonthString = 'next month';
    if (language === 'cy') {
      daysOfTheWeekArray = [
        'Dydd Llun',
        'Dydd Mawrth',
        'Dydd Mercher',
        'Dydd Iau',
        'Dydd Gwener',
        'Dydd Sadwrn',
        'Dydd Sul'
      ];
      previousMonthString = 'y mis blaenorol';
      nextMonthString = 'mis nesaf';
    }

    $('tfoot').remove();
    /* eslint-disable no-invalid-this */
    $('.dow').each(function tabIndexOnWeekDays(index) {
      const content = $(this).text();
      $(this).html(
        `<div aria-label="${daysOfTheWeekArray[index]}">${content}</div>`
      );
    });
    $('.prev').attr('role', 'button').attr('aria-label', previousMonthString);
    $('.next').attr('role', 'button').attr('aria-label', nextMonthString);
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

  addAccessibilityFeatures: language => {
    datePicker.hijackTabIndex();
    datePicker.addAriaAttributes(language);
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
        .closest('tr')
        .children()
        .index($(document.activeElement));
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
        $(document.activeElement)
          .closest('tr')
          .prev()
          .find(`td:eq(${index})`)
          .focus();
        break;
      case downArrowKey:
        event.preventDefault();
        $(document.activeElement)
          .closest('tr')
          .next()
          .find(`td:eq(${index})`)
          .focus();
        break;
      default:
        return true;
      }
    });
    /* eslint-enable consistent-return */
  },

  buildDatePicker: (datesDisabled, language) => {
    const previousImgString = 'previous';
    const nextImgString = 'next';
    let previousString = 'Previous month';
    let nextString = 'Next month';
    if (language === 'cy') {
      previousString = 'Y mis blaenorol';
      nextString = 'Mis nesaf';
    }

    datePicker
      .selector()
      .datepicker({
        language,
        multidate: true,
        daysOfWeekDisabled: '06',
        defaultViewDate: moment().add(eight, 'weeks').format('MM-D-YYYY'),
        startDate: '+8w',
        endDate: '+22w',
        weekStart: 1,
        maxViewMode: 0,
        datesDisabled,
        templates: {
          leftArrow: datePicker.toggleArrows(previousImgString, previousString),
          rightArrow: datePicker.toggleArrows(nextImgString, nextString)
        },
        beforeShowDay: date =>
          datePickerUtils.displayFirstOfMonth(date, language)
      })
      .on('changeDate', event =>
        datePicker.changeDateHandler(event, language)
      );
    datePicker.setUpDOWHeading(language);
    // Update the date-picker with dates that have already been added.
    datePicker.selector().datepicker(
      'setDates',
      datePicker.getData().map(date => date.value)
    );
    datePicker.selector().off('keydown');
    datePicker.enableKeyActions();
    $('.prev, .next').on('click', event => {
      if (
        $(event.target).hasClass('prev') ||
        $(event.target).hasClass('next')
      ) {
        window.setTimeout(datePicker.addAccessibilityFeatures(language), 0);
      }
    });
    window.setTimeout(datePicker.addAccessibilityFeatures(language), 0);
  },

  selector: () => $('#date-picker'),

  toggleArrows: (nextOrPrevImgArrow, nextOrPrevArrow) => {
    const assetPath = $('#asset-path').data('path');
    return `<img src="${assetPath}images/${nextOrPrevImgArrow}_arrow.png" alt="${nextOrPrevArrow}">`;
  },

  setUpDOWHeading: language => {
    let days = [];

    if (language === 'cy') {
      days = ['Ll', 'M', 'M', 'I', 'G', 'S', 'S'];
    } else {
      days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    }
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

  changeDateHandler: (event, language) => {
    const dates = event.dates;
    datePicker.addAccessibilityFeatures(language);
    const currentDates = datePicker.getData();
    const added = datePickerUtils.isDateAdded(currentDates, dates);
    const removed = datePickerUtils.isDateRemoved(currentDates, dates);
    if (added) {
      const selected = datePickerUtils.findCellByTimestamp(last(dates));
      datePicker.updateAriaAttributesOnSelect(selected);
      return datePicker.postDate(dates, language);
    } else if (removed) {
      const deselected = differenceWith(
        currentDates.map(value => value.value),
        dates,
        isEqual
      );
      const deselectedCell = datePickerUtils.findCellByTimestamp(deselected[0]);
      datePicker.updateAriaAttributesOnSelect(deselectedCell);
      return datePicker.removeDate(dates, language);
    }
    return datePicker.displayDateList(dates, language);
  },

  displayDateList: (dates, language) => {
    const datesIndex = dates.map((date, index) =>
      datePickerUtils.buildDatesArray(index, date)
    );
    const orderDates = datePickerUtils.sortDates(datesIndex);
    let elements = '';
    let removeLinkString = 'Remove';
    let noDatesAddedYetString = 'No dates added yet';
    if (language === 'cy') {
      removeLinkString = 'Tynnu';
      noDatesAddedYetString = "Dim dyddiadau wedi'u hychwanegu eto";
    }

    $.each(orderDates, (index, date) => {
      elements += `
      <dl class="govuk-summary-list__row">
        <dd id="govuk-summary-list__values-${date.index}" class="govuk-summary-list__value">
          <span data-index="items-${date.index}">
            ${datePickerUtils.formatDateForDisplay(date.value, language)}
          </span>
        </dd>
        <dd class="govuk-summary-list__actions">
          <a class="govuk-link" href="/dates-cant-attend/item-${date.index}/delete">${removeLinkString}</a>
        </dd>
      </dl>`;
    });
    if (elements === '') {
      const noItems = `
      <dl class="govuk-summary-list__row">
        <dd class="govuk-summary-list__value  noItems">${noDatesAddedYetString}</dd>
      </dl>`;
      $('.govuk-summary-list').empty().append(noItems);
    } else {
      $('.govuk-summary-list').empty().append(elements);
    }
  },

  postDate: (dates, language) => {
    const lastestDateAdded = last(dates);
    const mDate = moment(lastestDateAdded);
    const body = {
      'item.day': mDate.date().toString(),
      'item.month': (mDate.month() + 1).toString(),
      'item.year': mDate.year().toString()
    };
    const index = indexOf(dates, lastestDateAdded);
    const tokenSelector = '[name=_csrf]';
    return $.ajax({
      type: 'POST',
      url: `/dates-cant-attend/item-${index}`,
      headers: {
        'CSRF-Token': $(tokenSelector).length && $(tokenSelector).val()
      },
      data: body,
      success: () => datePicker.displayDateList(dates, language)
    });
  },

  removeDate: (dates, language) => {
    const data = datePicker.getData();
    const oldDates = data.map(date => date.value);
    const newDates = dates;
    const dateToRemove = differenceWith(oldDates, newDates, isEqual).toString();
    const index = datePickerUtils.getIndexFromDate(data, dateToRemove);

    return $.ajax({
      type: 'GET',
      url: `/dates-cant-attend/item-${index}/delete`,
      success: () => datePicker.displayDateList(newDates, language)
    });
  },

  getData: () => {
    const list = $(
      '.govuk-summary-list .govuk-summary-list__value > span.govuk-visually-hidden'
    ).toArray();
    return list.map(item =>
      datePickerUtils.buildDatesArray(
        datePickerUtils.getIndexOfDate(item),
        datePickerUtils.getValueOfDate(item)
      )
    );
  }
};

export default datePicker;
