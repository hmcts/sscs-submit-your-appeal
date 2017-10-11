'use strict';

const { expect } = require('test/util/chai');
const HearingArrangements = require('steps/hearing/hearing-arrangements/HearingArrangements');
const urls = require('urls');

describe('HearingArrangements.js', () => {

    let hearingArrangements;

    beforeEach(() => {
        hearingArrangements = new HearingArrangements();
    });

    after(() => {
        hearingArrangements = undefined;
    });

    describe('get url()', () => {

        it('returns url /hearing-arrangements', () => {
            expect(hearingArrangements.url).to.equal(urls.hearing.hearingArrangements);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = hearingArrangements.form.fields;
        });

        after(() => {
            fields = field = undefined;
        });

        describe('selection field', () => {

            beforeEach(() => {
                field = fields[0];
            });

            it('contains the field name selection', () => {
                expect(field.name).to.equal('selection');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('anythingElse field', () => {

            beforeEach(() => {
                field = fields[1];
            });

            it('contains the field name anythingElse', () => {
                expect(field.name).to.equal('anythingElse');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('next()', () => {

            it('returns the next step url /hearing-availability', () => {
                const redirector = {
                    nextStep: urls.hearing.hearingAvailability
                };
                hearingArrangements.journey = {
                    HearingAvailibility: urls.hearing.hearingAvailability
                };
                expect(hearingArrangements.next()).to.eql(redirector);
            });

        });

    });

});
