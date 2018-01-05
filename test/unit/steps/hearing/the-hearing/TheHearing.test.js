'use strict';

const TheHearing = require('steps/hearing/the-hearing/TheHearing');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('TheHearing.js', () => {

    let theHearing;

    beforeEach(() => {
        theHearing = new TheHearing({
            journey: {
                steps: {
                    HearingSupport: paths.hearing.hearingSupport,
                    NotAttendingHearing: paths.hearing.notAttendingHearing
                }
            }
        });

        theHearing.fields = {
            attendHearing: {}
        }
    });

    describe('get path()', () => {

        it('returns path /the-hearing', () => {
            expect(theHearing.path).to.equal(paths.hearing.theHearing);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = theHearing.form.fields
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('attendHearing');
        });

        describe('attendHearing field', () => {

            beforeEach(() => {
                field = fields.attendHearing;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name attendHearing', () => {
                expect(field.name).to.equal('attendHearing');
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

            theHearing.content = {
                cya: {
                    attendHearing: {
                        question
                    }
                }
            };

            theHearing.fields.attendHearing.value = value;

        });

        it('should contain a single answer', () => {
            const answers = theHearing.answers();
            expect(answers.length).to.equal(1);
            expect(answers[0].question).to.equal(question);
            expect(answers[0].section).to.equal(sections.theHearing);
            expect(answers[0].answer).to.equal(value);
        });

        it('should contain a value object', () => {
            const values = theHearing.values();
            expect(values).to.eql( { hearing: { wantsToAttend: false } });
        });
    });

    describe('next()', () => {

        it('returns the next step path /hearing-support when attendHearing value is Yes', () => {
            theHearing.fields.attendHearing.value = 'yes';
            expect(theHearing.next().step).to.eq(paths.hearing.hearingSupport);

        });

        it('returns the next step path /not-attending-hearing when attendHearing value is No', () => {
            theHearing.fields.attendHearing.value = 'no';
            expect(theHearing.next().step).to.eq(paths.hearing.notAttendingHearing);
        });

    });

});
