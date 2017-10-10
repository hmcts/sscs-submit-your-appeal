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

        beforeEach(() => {
            appointeeClass.fields = stub();
            appointeeClass.fields.appointee = {};
            appointeeClass.journey = {
                AppointeeDetails: urls.identity.enterAppointeeDetails,
                AppellantDetails: urls.identity.enterAppellantDetails
            };
        });

        it('returns branch object with condition property', () => {
            appointeeClass.fields.appointee.value = 'yes';
            const branches = appointeeClass.next().branches[0];
            expect(branches).to.have.property('condition');
        });

        it('returns branch object where condition nextStep equals /enter-appointee-details', () => {
            appointeeClass.fields.appointee.value = 'yes';
            const redirector = {
                nextStep: urls.identity.enterAppointeeDetails
            };
            const branches = appointeeClass.next().branches[0];
            expect(branches.redirector).to.eql(redirector)
        });

        it('returns fallback object where nextStep equals /enter-appellant-details', () => {
            appointeeClass.fields.appointee.value = 'no';
            const redirector = {
                nextStep: urls.identity.enterAppellantDetails
            };
            const fallback = appointeeClass.next().fallback;
            expect(fallback).to.eql(redirector);
        });

    });

});
