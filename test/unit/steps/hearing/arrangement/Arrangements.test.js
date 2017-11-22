'use strict';

const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const Arrangements = require('steps/hearing/support/Arrangements');
const paths = require('paths');
const answer = require('utils/answer');

describe('HearingSupport.js', () => {

    let arrangements;

    beforeEach(() => {
        arrangements = new Arrangements();
    });

    describe('get url()', () => {

        it('returns url /arrangements', () => {
            expect(arrangements.url).to.equal(paths.hearing.arrangements);
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
                HearingArrangements: paths.hearing.hearingArrangements,
                HearingAvailibility: paths.hearing.hearingAvailability
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
                nextStep: paths.hearing.hearingArrangements
            };
            const branches = arrangements.next().branches[0];
            expect(branches.redirector).to.eql(redirector)
        });

        it('returns fallback object where nextStep equals /hearing-availability', () => {
            arrangements.fields.arrangements.value = answer.NO;
            const redirector = {
                nextStep: paths.hearing.hearingAvailability
            };
            const fallback = arrangements.next().fallback;
            expect(fallback).to.eql(redirector);
        });

    });

});
