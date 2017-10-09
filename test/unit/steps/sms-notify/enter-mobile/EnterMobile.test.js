'use strict';

const { expect } = require('test/util/chai');
const EnterMobile = require('steps/sms-notify/enter-mobile/EnterMobile');

describe('EnterMobile.js', () => {

    let enterMobileClass;

    beforeEach(() => {
        enterMobileClass = new EnterMobile();
    });

    after(() => {
       enterMobileClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /enter-mobile', () => {
           expect(enterMobileClass.url).to.equal('/enter-mobile');
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

        it('contains the field name mobileNumber', () => {
           expect(field.name).to.equal('mobileNumber');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step url /sms-confirmation', () => {
            const redirector = {
                nextStep: '/sms-confirmation'
            };
            enterMobileClass.journey = {
                SmsConfirmation: '/sms-confirmation'
            };
            expect(enterMobileClass.next()).to.eql(redirector);
        });

    });


});
