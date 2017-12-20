'use strict';

const { expect } = require('test/util/chai');
const EnterMobile = require('steps/sms-notify/enter-mobile/EnterMobile');
const paths = require('paths');

describe('EnterMobile.js', () => {

    let enterMobile;

    beforeEach(() => {

        enterMobile = new EnterMobile({
            journey: {
                steps: {
                    SmsConfirmation: paths.smsNotify.smsConfirmation
                }
            }
        });

    });

    describe('get path()', () => {

        it('returns path /enter-mobile', () => {
           expect(EnterMobile.path).to.equal(paths.smsNotify.enterMobile);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = enterMobile.form.fields[0];
        });

        it('contains the field name enterMobile', () => {
           expect(field.name).to.equal('enterMobile');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('values()', () => {

        const value = '07411435779';

        beforeEach(() => {

            enterMobile.fields = {
                enterMobile: {
                    value
                }
            };

        });

        it('should contain a value object', () => {
            const values = enterMobile.values();
            expect(values).to.eql( { smsNotify: { smsNumber: value } });
        });

    });

    describe('next()', () => {

        it('returns the next step path /sms-confirmation', () => {
            expect(enterMobile.next()).to.eql({ nextStep: paths.smsNotify.smsConfirmation });
        });

    });


});
