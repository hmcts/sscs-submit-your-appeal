import datePicker from './bootstrap-datepicker1.8.0.min';
import $ from 'jquery';
import moment from "moment/moment";
import { indexOf, last } from "lodash";

$(document).ready(() => {

    dp.getDatesInSession();


    $('#date-picker').datepicker({
        multidate: true,
        daysOfWeekDisabled: '06',
        startDate: '+4w',
        endDate: '+22w',
        weekStart: 1
    }).on('changeDate', e => {
        const dates = e.dates;


        const lastestDateAdded = last(dates);
        const mDate = moment(lastestDateAdded);
        const body = {
            'item.day': mDate.date().toString(),
            'item.month': (mDate.month() + 1).toString(),
            'item.year': mDate.year().toString()
        };
        const index = indexOf(dates, lastestDateAdded);
        let elements = '';

        $.ajax({
            type: 'POST',
            url: `/dates-cant-attend/item-${index}`,
            data: body,
            success: () => {
                const meow = dp.getDatesInSession();
                meow.push(lastestDateAdded.toString());
                $('#date-picker').attr('data-dates', meow.toString());

                dates.forEach((date, i) => {
                    elements += `<div id="add-another-list-items-${i}"><dd class="add-another-list-item">${date}</dd></div>`;
                });
                if (elements === '') {
                    const noItems = '<div><dd class="add-another-list-item">No dates added yet</dd></div>';
                    $('.add-another-list').empty().append(noItems);
                } else {
                    $('.add-another-list').empty().append(elements);
                }
            }
        });
    });

});

const dp = {

    getDatesInSession: () => {

        const blah = $('#date-picker').data('dates');
        console.log(blah)

        console.log(Object.values(blah));

        blah.forEach((value, index) => {
           console.log(value);
           console.log(index)
        });


        // return $('#date-picker').attr('data-dates').split(',');
    },

    isDateUnselected: (d) => {
        const datesStored = this.getDatesInSession();
        return datesStored.length > d.length;
    }

};
