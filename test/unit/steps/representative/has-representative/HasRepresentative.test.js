'use strict';

const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const HasRepresentative = require('steps/representative/has-representative/HasRepresentative');
const content = require('steps/representative/has-representative/content.json');
const urls = require('urls');

describe('HasRepresentative.js', () => {

    let hasRepresentativeClass;

    beforeEach(() => {
        hasRepresentativeClass = new HasRepresentative();
    });

    after(() => {
        hasRepresentativeClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /representative', () => {
            expect(hasRepresentativeClass.url).to.equal(urls.representative.hasRepresentative);
        });

    });

    describe('get template()', () => {

        it('returns template path representative/has-representative/template', () => {
            expect(hasRepresentativeClass.template).to.equal('representative/has-representative/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(hasRepresentativeClass.i18NextContent).to.equal(content);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = hasRepresentativeClass.form.fields[0];
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
            hasRepresentativeClass.fields = stub();
            hasRepresentativeClass.fields.hasRepresentative = {};
            hasRepresentativeClass.journey = {
                RepresentativeDetails: urls.representative.representativeDetails,
                ReasonForAppealing: urls.reasonsForAppealing.reasonForAppealing
            };
        });

        it('returns branch object with condition property', () => {
            hasRepresentativeClass.fields.hasRepresentative.value = 'yes';
            const branches = hasRepresentativeClass.next().branches[0];
            expect(branches).to.have.property('condition');
        });

        it('returns branch object where condition nextStep equals /representative-details', () => {
            hasRepresentativeClass.fields.hasRepresentative.value = 'yes';
            const redirector = {
                nextStep: urls.representative.representativeDetails
            };
            const branches = hasRepresentativeClass.next().branches[0];
            expect(branches.redirector).to.eql(redirector)
        });

        it('returns fallback object where nextStep equals /reason-for-appealing', () => {
            hasRepresentativeClass.fields.hasRepresentative.value = 'no';
            const redirector = {
                nextStep: urls.reasonsForAppealing.reasonForAppealing
            };
            const fallback = hasRepresentativeClass.next().fallback;
            expect(fallback).to.eql(redirector);
        });

    });

});
