'use strict';

const { expect } = require('test/util/chai');
const TextReminders = require('steps/sms-notify/text-reminders/TextReminders');

describe('TextReminders.js', () => {

    let textRemindersClass;

    beforeEach(() => {
       textRemindersClass = new TextReminders();
       textRemindersClass.res = { locals: { session: {} } };
    });

    after(() => {
       textRemindersClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /appellant-text-reminders', () => {
            expect(textRemindersClass.url).to.equal('/appellant-text-reminders');
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
