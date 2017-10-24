'use strict';

const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const Representative = require('steps/representative/representative/Representative');
const paths = require('paths');
const answer = require('utils/answer');

describe('Representative.js', () => {

    let representativeClass;

    beforeEach(() => {
        representativeClass = new Representative();
    });

    describe('get url()', () => {

        it('returns url /representative', () => {
            expect(representativeClass.url).to.equal(paths.representative.representative);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = representativeClass.form.fields[0];
        });

        it('contains the field name hasRepresentative', () => {
            expect(field.name).to.equal('hasRepresentative');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        beforeEach(() => {
            representativeClass.fields = stub();
            representativeClass.fields.hasRepresentative = {};
            representativeClass.journey = {
                RepresentativeDetails: paths.representative.representativeDetails,
                ReasonForAppealing: paths.reasonsForAppealing.reasonForAppealing
            };
        });

        it('returns branch object with condition property', () => {
            representativeClass.fields.hasRepresentative.value = answer.YES;
            const branches = representativeClass.next().branches[0];
            expect(branches).to.have.property('condition');
        });

        it('returns branch object where condition nextStep equals /representative-details', () => {
            representativeClass.fields.hasRepresentative.value = answer.YES;
            const redirector = {
                nextStep: paths.representative.representativeDetails
            };
            const branches = representativeClass.next().branches[0];
            expect(branches.redirector).to.eql(redirector)
        });

        it('returns fallback object where nextStep equals /reason-for-appealing', () => {
            representativeClass.fields.hasRepresentative.value = answer.NO;
            const redirector = {
                nextStep: paths.reasonsForAppealing.reasonForAppealing
            };
            const fallback = representativeClass.next().fallback;
            expect(fallback).to.eql(redirector);
        });

    });

});
