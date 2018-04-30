import datePicker from './bootstrap-datepicker1.8.0.min';
import $ from 'jquery';
import moment from "moment/moment";
import { indexOf, last } from "lodash";

$(document).ready(() => {

    $('.add-another-add-link').hide();

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

                dates.forEach((date, i) => {
                    elements += `<div id="add-another-list-items-${i}"><dd class="add-another-list-item">${dp.formatDateForDisplay(date)}</dd></div>`;
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

    formatDateForDisplay: d => {
        const date = moment(d)
        return date.format('dddd D MMMM YYYY');
    }

};
