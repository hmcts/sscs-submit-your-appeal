'use strict';

const TextReminders = require('steps/sms-notify/text-reminders/TextReminders');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const answer = require('utils/answer');
const paths = require('paths');
const userAnswer = require('utils/answer');

describe('TextReminders.js', () => {

    let textReminders;

    beforeEach(() => {

       textReminders = new TextReminders({
           journey: {
               steps: {
                   SendToNumber: paths.smsNotify.sendToNumber,
                   EnterMobile: paths.smsNotify.enterMobile,
                   Representative: paths.representative.representative,
                   AppellantContactDetails: paths.identity.enterAppellantContactDetails
               }
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

    describe('answers() and values()', () => {

        const question = 'A Question';

        beforeEach(() => {

            textReminders.content = {
                cya: {
                    doYouWantTextMsgReminders: {
                        question
                    }
                }
            };

            textReminders.fields = {
                doYouWantTextMsgReminders: {}
            };

        });

        it('should set the question and section', () => {
            const answers = textReminders.answers();
            expect(answers.length).to.equal(1);
            expect(answers[0].question).to.equal(question);
            expect(answers[0].section).to.equal(sections.textMsgReminders);
        });

        it('should titleise the users selection to \'No\' for CYA', () => {
            textReminders.fields.doYouWantTextMsgReminders.value = userAnswer.NO;
            const answers = textReminders.answers();
            expect(answers[0].answer).to.equal('No');
        });

        it('should titleise the users selection to \'Yes\' for CYA', () => {
            textReminders.fields.doYouWantTextMsgReminders.value = userAnswer.YES;
            const answers = textReminders.answers();
            expect(answers[0].answer).to.equal('Yes');
        });

        it('should set doYouWantTextMsgReminders to false', () => {
            textReminders.fields.doYouWantTextMsgReminders.value = userAnswer.NO;
            const values = textReminders.values();
            expect(values).to.eql({ smsNotify: { wantsSMSNotifications: false } });
        });

        it('should set doYouWantTextMsgReminders to true', () => {
            textReminders.fields.doYouWantTextMsgReminders.value = userAnswer.YES;
            const values = textReminders.values();
            expect(values).to.eql({ smsNotify: { wantsSMSNotifications: true } });
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
