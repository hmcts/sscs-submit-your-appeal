'use strict';

const { expect } = require('test/util/chai');
const HearingArrangements = require('steps/hearing/arrangements/HearingArrangements');
const paths = require('paths');

describe('HearingArrangements.js', () => {

    let hearingArrangements;

    beforeEach(() => {

        hearingArrangements = new HearingArrangements({
            journey: {
                steps: {
                    HearingAvailability: paths.hearing.hearingAvailability
                }
            }
        });

    });

    describe('get path()', () => {

        it('returns path /arrangements', () => {
            expect(HearingArrangements.path).to.equal(paths.hearing.hearingArrangements);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = hearingArrangements.form.fields;
        });

        it('should contain 2 fields', () => {
            expect(Object.keys(fields).length).to.equal(2);
            expect(fields).to.have.all.keys('selection', 'anythingElse');
        });

        describe('selection field', () => {

            beforeEach(() => {
                field = fields.selection;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
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
                field = fields.anythingElse;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name anythingElse', () => {
                expect(field.name).to.equal('anythingElse');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers', () => {

        beforeEach(() => {

            hearingArrangements.content = {
                cya: {
                    selection: {
                        question: 'Your hearing arrangement'
                    },
                    anythingElse: {
                        question: 'Any other arrangements'
                    }
                }
            };

            hearingArrangements.fields = {
                selection: {
                    value: []
                },
                anythingElse: {
                    value: 'Nope, not today!'
                }
            };

        });

        it('should set the question and section', () => {
            const answers = hearingArrangements.answers();
            expect(answers.length).to.equal(2);
        });

    });

    describe('values', () => {

    });

    describe('next()', () => {

        it('returns the next step path /hearing-availability', () => {
            expect(hearingArrangements.next()).to.eql({ nextStep: paths.hearing.hearingAvailability });
        });

    });

});
