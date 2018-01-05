'use strict';

const HearingAvailability = require('steps/hearing/availability/HearingAvailability');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('HearingAvailability.js', () => {

    let hearingAvailability;

    beforeEach(() => {
        hearingAvailability = new HearingAvailability({
            journey: {
                steps: {
                    CheckYourAppeal: paths.checkYourAppeal,
                    DatesCantAttend: paths.hearing.datesCantAttend
                }
            }
        });

        hearingAvailability.fields = {
            scheduleHearing: {}
        }
    });

    describe('get path()', () => {

        it('returns path /hearing-availability', () => {
            expect(HearingAvailability.path).to.equal(paths.hearing.hearingAvailability);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = hearingAvailability.form.fields;
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('scheduleHearing');
        });

        describe('scheduleHearing field', () => {

            beforeEach(() => {
                field = fields.scheduleHearing;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name scheduleHearing', () => {
                expect(field.name).to.equal('scheduleHearing');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers() and values()', () => {

        const question = 'A Question';
        const value = 'No';

        beforeEach(() => {

            hearingAvailability.content = {
                cya: {
                    scheduleHearing: {
                        question
                    }
                }
            };

            hearingAvailability.fields.scheduleHearing.value = value;

        });

        it('should contain a single answer', () => {
            const answers = hearingAvailability.answers();
            expect(answers.length).to.equal(1);
            expect(answers[0].question).to.equal(question);
            expect(answers[0].section).to.equal(sections.theHearing);
            expect(answers[0].answer).to.equal(value);
        });

        it('should contain a value object', () => {
            const values = hearingAvailability.values();
            expect(values).to.eql( { hearing: { scheduleHearing: false } });
        });
    });

    describe('next()', () => {

        it('returns the next step path /dates-cant-attend when scheduleHearing value is Yes', () => {
            hearingAvailability.fields.scheduleHearing.value = 'yes';
            expect(hearingAvailability.next().step).to.eq(paths.hearing.datesCantAttend);

        });

        it('returns the next step path /check-your-appeal when scheduleHearing value is No', () => {
            hearingAvailability.fields.scheduleHearing.value = 'no';
            expect(hearingAvailability.next().step).to.eq(paths.checkYourAppeal);
        });

    });

});
