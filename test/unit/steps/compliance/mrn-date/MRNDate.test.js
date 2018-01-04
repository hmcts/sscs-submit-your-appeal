'use strict';

const { expect } = require('test/util/chai');
const DateUtils = require('utils/DateUtils');
const MRNDate = require('steps/compliance/mrn-date/MRNDate');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');

describe('MRNDate.js', () => {

    let mrnDate;

    beforeEach(() => {

        mrnDate = new MRNDate({
            journey: {
                steps: {
                    Appointee: paths.identity.areYouAnAppointee,
                    CheckMRN:  paths.compliance.checkMRNDate
                }
            }
        });

        mrnDate.fields = {
            day: {},
            month: {},
            year: {}
        };
    });

    describe('get path()', () => {

        it('returns path /mrn-date', () => {
            expect(MRNDate.path).to.equal(paths.compliance.mrnDate);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = mrnDate.form.fields
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

            it('contains the field name day', () => {
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

        beforeEach(() => {

            mrnDate.fields = {
                day: {
                    value: '13'
                },
                month: {
                    value: '12'
                },
                year: {
                    value: '2017'
                }
            };

            mrnDate.content = {
                cya: {
                    mrnDate: {
                        question
                    }
                }
            };

        });

        it('should contain a single answer', () => {
            const answers = mrnDate.answers();
            expect(answers.length).to.equal(1);
            expect(answers[0].question).to.equal(question);
            expect(answers[0].section).to.equal(sections.mrnDate);
            expect(answers[0].answer).to.equal('13/12/2017');
        });

        it('should contain a value object', () => {
            const values = mrnDate.values();
            expect(values).to.eql( { mrn: { date: '13-12-2017' } });
        });
    });

    describe('next()', () => {

        const setMRNDate = date => {
            mrnDate.fields.day.value = date.date();
            mrnDate.fields.month.value = date.month() + 1;
            mrnDate.fields.year.value = date.year();
        };

        it('returns the next step path /are-you-an-appointee if date less than a month', () => {
            setMRNDate(DateUtils.oneDayShortOfAMonthAgo());
            expect(mrnDate.next().step).to.eql(paths.identity.areYouAnAppointee);
        });

        it('returns the next step path /are-you-an-appointee if date is equal to a month', () => {
            setMRNDate(DateUtils.oneMonthAgo());
            expect(mrnDate.next().step).to.eql(paths.identity.areYouAnAppointee);
        });

        it('returns the next step path /check-mrn-date if date more than a month', () => {
            setMRNDate(DateUtils.oneMonthAndOneDayAgo());
            expect(mrnDate.next().step).to.eql(paths.compliance.checkMRNDate);
        });

    });

});
