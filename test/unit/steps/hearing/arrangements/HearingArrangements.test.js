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

        hearingArrangements.fields = {
            selection: {
                value: {
                    interpreterLanguage: {
                        requested: true,
                        language: 'A language'
                    },
                    signLanguage: {
                        requested: false
                    },
                    hearingLoop: {
                        requested: true
                    },
                    accessibleHearingRoom: {
                      requested: false
                    },
                    anythingElse: {
                        requested: true,
                        language: 'more support'
                    }
                }
            }
        }

    });

    describe('get path()', () => {

        it('returns path /arrangements', () => {
            expect(HearingArrangements.path).to.equal(paths.hearing.hearingArrangements);
        });

    });

    describe('get cyaArrangements()', () => {

        it('returns object of the selection fields where the value us replaced by the hidden fields', () => {
           expect(hearingArrangements.cyaArrangements).to.eql({
               interpreterLanguage: 'A language',
               signLanguage: 'Not required',
               hearingLoop: 'Required',
               accessibleHearingRoom: 'Not required',
               anythingElse: 'more support'
           });
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = hearingArrangements.form.fields;
        });

        it('should contain 2 fields', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('selection');
        });

        describe('selection field', () => {

            beforeEach(() => {
                field = fields.selection;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDescriptor');
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
                expect(field.constructor.name).to.eq('FieldDescriptor');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('interpreterLanguageType field', () => {

            beforeEach(() => {
                field = fields.interpreterLanguageType;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name interpreterLanguageType', () => {
                expect(field.name).to.equal('interpreterLanguageType');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('signLanguageType field', () => {

            beforeEach(() => {
                field = fields.signLanguageType;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name signLanguageType', () => {
                expect(field.name).to.equal('signLanguageType');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers()', () => {

        let answers;

        before(() => {
            answers = hearingArrangements.answers()[0];
        });

        it('should return expected section', () => {
            expect(answers.section).to.equal('hearing-arrangements');
        });

        it('should return expected template', () => {
            expect(answers.template).to.equal('answer.html');
        });

    });

    describe('values()', () => {

        it('should contain a value object', () => {
            const values = hearingArrangements.values();
            expect(values).to.eql({
                hearing: {
                    arrangements: {
                        languageInterpreter: true,
                        signLanguageInterpreter: false,
                        hearingLoop: true,
                        accessibleHearingRoom: false,
                        other: true
                    },
                    interpreterLanguageType: 'A language',
                    signLanguageType: undefined,
                    anythingElse: 'more support'
                }
            });
        });

    });

    describe('next()', () => {

        it('returns the next step path /hearing-availability', () => {
            expect(hearingArrangements.next()).to.eql({ nextStep: paths.hearing.hearingAvailability });
        });

    });

});
