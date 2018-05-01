import datePicker from './bootstrap-datepicker1.8.0.min';
import $ from 'jquery';
import moment from "moment/moment";
import { differenceWith, find, indexOf, isEqual, last } from "lodash";

$(document).ready(() => {

    $('.add-another-add-link').hide();
    dp.dateRange();

    $('#date-picker').datepicker({
        multidate: true,
        daysOfWeekDisabled: '06',
        startDate: '+4w',
        endDate: '+22w',
        weekStart: 1
    }).on('changeDate', e => {
        const dates = e.dates;

        if (dp.isDateAdded(dates)) {
            dp.postDate(dates);
        } else if(dp.isDateRemoved(dates)) {
            dp.removeDate(dates);
        } else {
            dp.displayDateList(dates);
        }
    });

    // Update the date-picker with dates that have already been added.
    $('#date-picker').datepicker('setDates', dp.getData().map(date => date.value));

});

const dp = {

    dateRange: () => {

        const dates = [
            '12-25-2018',
            '12-26-2018',
            '12-28-2018'
        ];

        dates.forEach((date, index) => {
            console.log('***********')
          const prevIndex = index === 0 ? undefined : index - 1;
          const prevDate = prevIndex !== undefined ? dates[prevIndex] : undefined;
          console.log(prevDate)
            console.log(date)

          if (prevDate !== undefined) {
              const a = new Date(prevDate);
              const b = new Date(date);
              const c = new Date(prevDate);
              c.setDate(c.getDate() + 1);

              console.log(a);
              console.log(b.getTime());
              console.log(c.getTime());

              // console.log(a.add(1, 'days'))



              if (c.getTime() === b.getTime()) {
                  console.log('here');
                  const meow = `${dp.formatDateForDisplay(a)} to ${dp.formatDateForDisplay(b)}`;
                  console.log(meow);
              } else {
                  console.log('not here')
                  console.log(dp.formatDateForDisplay(b))
              }
          }

        });
    },

    displayDateList: dates => {

        let elements = '';

        dates.forEach((date, i) => {
            elements += `<div id="add-another-list-items-${i}">
                            <dd class="add-another-list-item">
                                <span data-index="items-${i}">${dp.formatDateForDisplay(date)}</span>
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
        const oldDates = dp.getDates();
        const newDates = dates;
        const dateToRemove = differenceWith(oldDates, newDates, isEqual).toString();
        const index = dp.getIndexFromDate(dateToRemove);

        $.ajax({
            type: 'GET',
            url: `/dates-cant-attend/item-${index}/delete`,
            success: () => {
                dp.displayDateList(newDates);
            }
        })
    },

    getIndexFromDate: date => {
        const data = dp.getData();
        return find(data, { value: new Date(date) }).index;
    },

    getIndexOfDate: element => {
        return $(element).data('index').split("-").pop();
    },

    getValueOfDate: element => {
        return new Date($(element).text());
    },

    getDates: () => {
        const list = $('.add-another-list .add-another-list-item > span').toArray();
        return list.map(item => dp.getValueOfDate(item));
    },

    getData: () => {
      // loop over table and get results
        const list = $('.add-another-list .add-another-list-item > span').toArray();
        return list.map(item => {
            return {
                index: dp.getIndexOfDate(item),
                value: dp.getValueOfDate(item)
            };
        });
    },

    formatDateForDisplay: d => {
        const date = moment(d);
        return date.format('dddd D MMMM YYYY');
    },

    isDateAdded: (newDateList) => {
        const currentDateList = dp.getData();
        return newDateList.length > currentDateList.length;
    },

    isDateRemoved: (newDateList) => {
        const currentDateList = dp.getData();
        return currentDateList.length > newDateList.length;
    }

};
