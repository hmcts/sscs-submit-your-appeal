'use strict';

const { expect } = require('test/util/chai');
const TextReminders = require('steps/sms-notify/text-reminders/TextReminders');
const urls = require('urls');

describe('TextReminders.js', () => {

    let textRemindersClass;

    beforeEach(() => {
       textRemindersClass = new TextReminders();
       textRemindersClass.journey = {
           AppellantDetails: {}
       };
       textRemindersClass.fields = {
           appellantPhoneNumber: {}
       };
    });

    describe('url()', () => {

        it('returns url /appellant-text-reminders', () => {
            expect(textRemindersClass.url).to.equal('/appellant-text-reminders');
        });

    });

    describe('signUpLink()', () => {

        it('returns \'/enter-number\' when the number provided is an empty string', () => {
            textRemindersClass.fields.appellantPhoneNumber.value = '';
            expect(textRemindersClass.signUpLink).to.equal(urls.smsNotify.enterMobile);
        });

        it('returns \'/enter-number\' when the number provided is not a mobile number', () => {
            textRemindersClass.fields.appellantPhoneNumber.value = '03453003943';
            expect(textRemindersClass.signUpLink).to.equal(urls.smsNotify.enterMobile);
        });

        it('returns \'/send-to-number\' when the number provided is a mobile number', () => {
            textRemindersClass.fields.appellantPhoneNumber.value = '07422756889';
            expect(textRemindersClass.signUpLink).to.equal(urls.smsNotify.sendToNumber);
        });

    });

    describe('get form()', () => {

        it('should contain a single field', () => {
            expect(textRemindersClass.form.fields.length).to.equal(1);
        });

        it('should contain a textField reference called \'appellantPhoneNumber\'', () => {
            const textField = textRemindersClass.form.fields[0];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('appellantPhoneNumber');
            expect(textField.validations).to.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step url /sms-confirmation', () => {
            const redirector = {
                nextStep: urls.smsNotify.enterMobile
            };
            textRemindersClass.journey = {
                EnterMobile: urls.smsNotify.enterMobile
            };
            expect(textRemindersClass.next()).to.eql(redirector);
        });

    });

});
