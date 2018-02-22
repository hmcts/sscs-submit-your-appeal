'use strict';

const DatesCantAttend = require('steps/hearing/dates-cant-attend/DatesCantAttend');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');
const moment = require('moment');
const content = require('steps/hearing/dates-cant-attend/content.en');

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
            items: {}
        }
    });

    describe('get path()', () => {

        it('returns path /dates-cant-attend', () => {
            expect(DatesCantAttend.path).to.equal(paths.hearing.datesCantAttend);
        });

    });

    describe('get addAnotherLinkContent()', () => {

        it('returns false when items is undefined', () => {
            datesCantAttend.fields.items = undefined;
            expect(datesCantAttend.addAnotherLinkContent).to.be.false;
        });

        it('returns add link when there are no items in the list', () => {
            datesCantAttend.fields.items.value = [];
            expect(datesCantAttend.addAnotherLinkContent).to.equal(content.links.add);
        });

        it('returns addAnother link when there are items in the list', () => {
            datesCantAttend.fields.items.value = [moment()];
            expect(datesCantAttend.addAnotherLinkContent).to.equal(content.links.addAnother);
        });

    });

    describe('get field()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = datesCantAttend.form.fields;
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('items');
        });

        describe('items field', () => {

            beforeEach(() => {
                field = fields.items;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDescriptor');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers() and values()', () => {

        const question = 'A Question';
        const value = [
            moment().add(5, 'weeks'),
            moment().add(6, 'weeks')
        ];
        const answersMappedValue = value.map(d => d.format('DD MMMM YYYY'));
        const valuesMappedValue = value.map(d => d.format('DD-MM-YYYY'));

        beforeEach(() => {

            datesCantAttend.content = {
                cya: {
                    dateYouCantAttend: {
                        question
                    }
                }
            };

            datesCantAttend.fields.items.value = value

        });

        it('should contain a single answer', () => {
            const answers = datesCantAttend.answers();
            expect(answers.length).to.equal(1);
            expect(answers[0].question).to.equal(question);
            expect(answers[0].section).to.equal(sections.theHearing);
            expect(answers[0].answer).to.eql(answersMappedValue);
            expect(answers[0].url).to.eql(paths.hearing.hearingAvailability);
        });

        it('should contain a value object when dates array is not empty', () => {
            const values = datesCantAttend.values();
            expect(values).to.eql( { hearing: { datesCantAttend: valuesMappedValue } });
        });

        it('should contain an empty object when dates array is empty', () => {
            datesCantAttend.fields.items.value = [];
            const values = datesCantAttend.values();
            expect(values).to.eql({});
        });

    });

    describe('next()', () => {

        it('returns the next step path /check-your-appeal', () => {
            expect(datesCantAttend.next().step).to.eq(paths.checkYourAppeal);

        });

    });

});
