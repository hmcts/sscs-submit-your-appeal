'use strict';

const DatesCantAttend = require('steps/hearing/dates-cant-attend/DatesCantAttend');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('DatesCantAttend.js', () => {

    let datesCantAttend;

    beforeEach(() => {
        datesCantAttend = new DatesCantAttend({
            journey: {
                steps: {
                    CheckYourAppeal: paths.checkYourAppeal,
                    DatesCantAttend: paths.hearing.datesCantAttend
                }
            }
        });

        datesCantAttend.fields = {
            day: {},
            month: {},
            year: {}
        }
    });

    describe('get path()', () => {

        it('returns path /dates-cant-attend', () => {
            expect(DatesCantAttend.path).to.equal(paths.hearing.datesCantAttend);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = datesCantAttend.form.fields;
        });

        it('should contain 3 fields', () => {
            expect(Object.keys(fields).length).to.equal(3);
            expect(fields).to.have.all.keys('day', 'month', 'year');
        });

        describe('day field', () => {

            beforeEach(() => {
                field = fields.day;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field day title', () => {
                expect(field.name).to.equal('day');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('month field', () => {

            beforeEach(() => {
                field = fields.month;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name month', () => {
                expect(field.name).to.equal('month');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('year field', () => {

            beforeEach(() => {
                field = fields.year;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name year', () => {
                expect(field.name).to.equal('year');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers() and values()', () => {

        const question = 'A Question';
        const value = '1/1/2022';

        beforeEach(() => {

            datesCantAttend.content = {
                cya: {
                    dateYouCantAttend: {
                        question
                    }
                }
            };

            datesCantAttend.fields.day.value = '1';
            datesCantAttend.fields.month.value = '1';
            datesCantAttend.fields.year.value = '2022';

        });

        it('should contain a single answer', () => {
            const answers = datesCantAttend.answers();
            expect(answers.length).to.equal(1);
            expect(answers[0].question).to.equal(question);
            expect(answers[0].section).to.equal(sections.theHearing);
            expect(answers[0].answer).to.equal(value);
        });

        it('should contain a value object', () => {
            const values = datesCantAttend.values();
            expect(values).to.eql( { hearing: { datesCantAttend: [value] } });
        });

    });

    describe('next()', () => {

        it('returns the next step path /check-your-appeal', () => {
            expect(datesCantAttend.next().step).to.eq(paths.checkYourAppeal);

        });

    });

});
