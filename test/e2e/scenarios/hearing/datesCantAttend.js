'use strict';

const content = require('steps/hearing/dates-cant-attend/content.en');
const paths = require('paths');
const moment = require('moment');
const date = moment();

Feature('Dates can\'t attend');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.hearing.datesCantAttend)
});

After((I) => {
    I.endTheSession();
});

Scenario('When I go to the page and there are no dates I see the Add date link', (I) => {

    I.see(content.noDates);
    I.see(content.links.add);

});

Scenario('When I click the Add date link, I go to the page where I can enter dates', (I) => {

    I.see(content.noDates);
    I.click(content.links.add);
    I.see(content.fields.cantAttendDate.legend);
    I.seeElement('.form-group-day input');
    I.seeElement('.form-group-month input');
    I.seeElement('.form-group-year input');

});

Scenario('When I add a date I see the date in the list', (I) => {

    I.click(content.links.add);
    I.enterDateCantAttendAndContinue(date);
    I.see(date.format('dddd, D MMMM YYYY'));

});

Scenario('When I add multiple dates, I see them in the list', (I) => {

    const additionalDate = moment().add(5, 'days').add(2, 'months');
    I.click(content.links.add);
    I.enterDateCantAttendAndContinue(date);
    I.enterDateCantAttendAndContinue(additionalDate);
    I.see(date.format('dddd, D MMMM YYYY'));
    I.see(additionalDate.format('dddd, D MMMM YYYY'));

});

Scenario('When I add a date I see the add another date link', (I) => {

    I.click(content.links.add);
    I.enterDateCantAttendAndContinue(date);
    I.see(content.links.addAnother);

});

Scenario('When I add a date and click the delete link, the date is removed', (I) => {

    I.click(content.links.add);
    I.enterDateCantAttendAndContinue(date);
    I.see(date.format('dddd, D MMMM YYYY'));
    I.click('Delete');
    I.dontSee(date.format('dddd, D MMMM YYYY'));

});

Scenario('When I add a date and the remove it, the add another date link goes back to add date when only one date in the list', (I) => {

    I.click(content.links.add);
    I.enterDateCantAttendAndContinue(date);
    I.see(content.links.addAnother);
    I.click('Delete');
    I.dontSee(content.links.addAnother);
    I.see(content.links.add);

});

Scenario('When I click Continue without add a date, I see errors', (I) => {

   I.click('Continue');
   I.see(content.noDates);

});

Scenario('When I add a date and the edit it, I see the new date', (I) => {

    const editedDate = moment().add(5, 'days').add(2, 'months');
    I.click(content.links.add);
    I.enterDateCantAttendAndContinue(date);
    I.see(date.format('dddd, D MMMM YYYY'));
    I.click('Edit');
    I.enterDateCantAttendAndContinue(editedDate);
    I.dontSee(date.format('dddd, D MMMM YYYY'));
    I.see(editedDate.format('dddd, D MMMM YYYY'));

});

Scenario('When I click Continue without filling in the date fields, I see errors', (I) => {

    I.click(content.links.add);
    I.click('Continue');
    I.see(content.fields.cantAttendDate.error.allRequired);

});

Scenario('When I click Continue when only entering the day field, I see errors', (I) => {

    I.click(content.links.add);
    I.fillField('.form-group-day input',  date.date());
    I.click('Continue');
    I.see(content.fields.cantAttendDate.error.monthRequired);
    I.see(content.fields.cantAttendDate.error.yearRequired);

});

Scenario('When I click Continue when only entering the month field, I see errors', (I) => {

    I.click(content.links.add);
    I.fillField('.form-group-month input',  date.month() + 1);
    I.click('Continue');
    I.see(content.fields.cantAttendDate.error.dayRequired);
    I.see(content.fields.cantAttendDate.error.yearRequired);

});

Scenario('When I click Continue when only entering the year field, I see errors', (I) => {

    I.click(content.links.add);
    I.fillField('.form-group-year input',  date.year());
    I.click('Continue');
    I.see(content.fields.cantAttendDate.error.dayRequired);
    I.see(content.fields.cantAttendDate.error.monthRequired);

});
