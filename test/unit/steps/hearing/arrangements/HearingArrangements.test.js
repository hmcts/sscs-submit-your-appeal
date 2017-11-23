'use strict';

const { expect } = require('test/util/chai');
const HearingArrangements = require('steps/hearing/arrangements/HearingArrangements');
const paths = require('paths');

describe('HearingArrangements.js', () => {

    let hearingArrangements;

    beforeEach(() => {

        hearingArrangements = new HearingArrangements({
            journey: {
                HearingAvailability: paths.hearing.hearingAvailability
            }
        });
    });

    describe('get url()', () => {

        it('returns url /arrangements', () => {
            expect(hearingArrangements.url).to.equal(paths.hearing.hearingArrangements);
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
                expect(hearingArrangements.next()).to.eql({ nextStep: paths.hearing.hearingAvailability });
            });

        });

    });

});
