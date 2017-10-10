'use strict';

const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const Representative = require('steps/representative/representative/Representative');
const urls = require('urls');

describe('Representative.js', () => {

    let representativeClass;

    beforeEach(() => {
        representativeClass = new Representative();
    });

    after(() => {
        representativeClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /representative', () => {
            expect(representativeClass.url).to.equal(urls.representative.representative);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = representativeClass.form.fields[0];
        });

        after(() => {
            field = undefined;
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
                RepresentativeDetails: urls.representative.representativeDetails,
                ReasonForAppealing: urls.reasonsForAppealing.reasonForAppealing
            };
        });

        it('returns branch object with condition property', () => {
            representativeClass.fields.hasRepresentative.value = 'yes';
            const branches = representativeClass.next().branches[0];
            expect(branches).to.have.property('condition');
        });

        it('returns branch object where condition nextStep equals /representative-details', () => {
            representativeClass.fields.hasRepresentative.value = 'yes';
            const redirector = {
                nextStep: urls.representative.representativeDetails
            };
            const branches = representativeClass.next().branches[0];
            expect(branches.redirector).to.eql(redirector)
        });

        it('returns fallback object where nextStep equals /reason-for-appealing', () => {
            representativeClass.fields.hasRepresentative.value = 'no';
            const redirector = {
                nextStep: urls.reasonsForAppealing.reasonForAppealing
            };
            const fallback = representativeClass.next().fallback;
            expect(fallback).to.eql(redirector);
        });

    });

});
