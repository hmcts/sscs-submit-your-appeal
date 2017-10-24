'use strict';

const { expect } = require('test/util/chai');
const EnterMobile = require('steps/sms-notify/enter-mobile/EnterMobile');
const paths = require('paths');

describe('EnterMobile.js', () => {

    let enterMobileClass;

    beforeEach(() => {
        enterMobileClass = new EnterMobile();
        enterMobileClass.journey = {};
    });

    after(() => {
       enterMobileClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /enter-mobile', () => {
           expect(enterMobileClass.url).to.equal(paths.smsNotify.enterMobile);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = enterMobileClass.form.fields[0];
        });

        after(() => {
            field = undefined;
        });

        it('contains the field name enterMobile', () => {
           expect(field.name).to.equal('enterMobile');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step url /sms-confirmation', () => {
            enterMobileClass.journey.SmsConfirmation = paths.smsNotify.smsConfirmation;
            expect(enterMobileClass.next()).to.eql({ nextStep: paths.smsNotify.smsConfirmation });
        });

    });


});
