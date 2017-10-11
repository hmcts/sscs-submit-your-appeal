'use strict';

const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const Arrangements = require('steps/hearing/arrangement/Arrangements');
const urls = require('urls');
const answer = require('utils/answer');

describe('Arrangements.js', () => {

    let arrangements;

    beforeEach(() => {
        arrangements = new Arrangements();
    });

    after(() => {
        arrangements = undefined;
    });

    describe('get url()', () => {

        it('returns url /arrangements', () => {
            expect(arrangements.url).to.equal(urls.hearing.arrangements);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = arrangements.form.fields[0];
        });

        after(() => {
            field = undefined;
        });

        it('contains the field name arrangements', () => {
            expect(field.name).to.equal('arrangements');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        beforeEach(() => {
            arrangements.fields = stub();
            arrangements.fields.arrangements = {};
            arrangements.journey = {
                HearingArrangements: urls.hearing.hearingArrangements,
                HearingAvailibility: urls.hearing.hearingAvailability
            };
        });

        it('returns branch object with condition property', () => {
            arrangements.fields.arrangements.value = answer.YES;
            const branches = arrangements.next().branches[0];
            expect(branches).to.have.property('condition');
        });

        it('returns branch object where condition nextStep equals /hearing-arrangements', () => {
            arrangements.fields.arrangements.value = answer.YES;
            const redirector = {
                nextStep: urls.hearing.hearingArrangements
            };
            const branches = arrangements.next().branches[0];
            expect(branches.redirector).to.eql(redirector)
        });

        it('returns fallback object where nextStep equals /hearing-availability', () => {
            arrangements.fields.arrangements.value = answer.NO;
            const redirector = {
                nextStep: urls.hearing.hearingAvailability
            };
            const fallback = arrangements.next().fallback;
            expect(fallback).to.eql(redirector);
        });

    });

});
