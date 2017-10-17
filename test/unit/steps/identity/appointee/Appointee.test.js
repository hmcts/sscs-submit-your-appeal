'use strict';

const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const Appointee = require('steps/identity/appointee/Appointee');
const urls = require('urls');

describe('Appointee.js', () => {

    let appointeeClass;

    beforeEach(() => {
        appointeeClass = new Appointee();
    });

    after(() => {
        appointeeClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /are-you-an-appointee', () => {
            expect(appointeeClass.url).to.equal(urls.identity.areYouAnAppointee);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = appointeeClass.form.fields[0];
        });

        after(() => {
            field = undefined;
        });

        it('contains the field name appointee', () => {
            expect(field.name).to.equal('appointee');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step url /enter-appellant-details', () => {
            const redirector = {
                nextStep: urls.identity.enterAppellantDetails
            };
            appointeeClass.journey = {
                AppellantDetails: urls.identity.enterAppellantDetails
            };
            expect(appointeeClass.next()).to.eql(redirector);
        });

    });

});
