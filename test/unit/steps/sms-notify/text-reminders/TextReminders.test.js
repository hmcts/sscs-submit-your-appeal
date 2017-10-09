'use strict';

const { expect } = require('test/util/chai');
const TextReminders = require('steps/sms-notify/text-reminders/TextReminders');

describe('TextReminders.js', () => {

    let textRemindersClass;

    beforeEach(() => {
       textRemindersClass = new TextReminders();
    });

    after(() => {
       textRemindersClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /appellant-text-reminders', () => {
            expect(textRemindersClass.url).to.equal('/appellant-text-reminders');
        });

    });

    describe('get template()', () => {

        it('returns template path sms-notify/text-reminders/template', () => {
            textRemindersClass.locals = {
                session: {
                    AppellantDetails_phoneNumber: '07223456789'
                }
            };
            expect(textRemindersClass.template).to.equal('sms-notify/text-reminders/template');
        });

    });

    describe('next()', () => {

        it('returns the next step url /sms-confirmation', () => {
            const redirector = {
                nextStep: '/enter-mobile'
            };
            textRemindersClass.journey = {
                EnterMobile: '/enter-mobile'
            };
            expect(textRemindersClass.next()).to.eql(redirector);
        });

    });

});
