'use strict';

const { expect } = require('test/util/chai');
const TextReminders = require('steps/sms-notify/text-reminders/TextReminders');
const paths = require('paths');
const answer = require('utils/answer');

describe('TextReminders.js', () => {

    let textReminders;

    beforeEach(() => {

       textReminders = new TextReminders({
           journey: {
               SendToNumber: paths.smsNotify.sendToNumber,
               EnterMobile: paths.smsNotify.enterMobile,
               Representative: paths.representative.representative,
               AppellantContactDetails: paths.identity.enterAppellantContactDetails
           }
       });

       textReminders.fields = {
           doYouWantTextMsgReminders: {},
           phoneNumber: {}
       };
    });

    describe('get path()', () => {

        it('returns path /appellant-text-reminders', () => {
            expect(TextReminders.path).to.equal(paths.smsNotify.appellantTextReminders);
        });

    });

    describe('get form()', () => {

        it('should contain a single field', () => {
            expect(textReminders.form.fields.length).to.equal(2);
        });

        it('should contain a textField reference called \'phoneNumber\'', () => {
            const textField = textReminders.form.fields[0];
            expect(textField.constructor.name).to.eq('FieldDesriptor');
            expect(textField.name).to.equal('doYouWantTextMsgReminders');
            expect(textField.validations).to.not.be.empty;
        });

        it('should contain a textField reference called \'phoneNumber\'', () => {
            const textField = textReminders.form.fields[1];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('phoneNumber');
            expect(textField.validations).to.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step path /send-to-number', () => {
            textReminders.fields.doYouWantTextMsgReminders.value = answer.YES;
            textReminders.fields.phoneNumber.value = '07455654886';
            const nextStep = textReminders.next().branches[0].redirector.nextStep;
            expect(nextStep).to.eq(paths.smsNotify.sendToNumber);
        });

        it('returns the next step path /enter-mobile', () => {
            textReminders.fields.doYouWantTextMsgReminders.value = answer.YES;
            textReminders.fields.phoneNumber.value = '01277456378';
            const nextStep = textReminders.next().branches[0].redirector.nextStep;
            expect(nextStep).to.eq(paths.smsNotify.enterMobile);
        });

        it('returns the next step path /representative', () => {
            textReminders.fields.doYouWantTextMsgReminders.value = answer.NO;
            const nextStep = textReminders.next().fallback.nextStep;
            expect(nextStep).to.eq(paths.representative.representative);
        });

    });

});
