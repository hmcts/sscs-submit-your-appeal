'use strict';

const HearingSupport = require('steps/hearing/support/HearingSupport');
const { expect } = require('test/util/chai');
const paths = require('paths');
const userAnswer = require('utils/answer');

describe('HearingSupport.js', () => {

    let hearingSupport;

    beforeEach(() => {
        hearingSupport = new HearingSupport({
            journey: {
                steps: {
                    HearingAvailability: paths.hearing.hearingAvailability,
                    HearingArrangements: paths.hearing.hearingArrangements
                }
            }
        });

        hearingSupport.fields = {
            arrangements: {}
        }
    });

    describe('get path()', () => {

        it('returns path /hearing-support', () => {
            expect(HearingSupport.path).to.equal(paths.hearing.hearingSupport);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = hearingSupport.form.fields
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('arrangements');
        });

        describe('arrangements field', () => {

            beforeEach(() => {
                field = fields.arrangements;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name arrangements', () => {
                expect(field.name).to.equal('arrangements');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('values()', () => {

        before(() => {
            hearingSupport.fields.arrangements.value = userAnswer.NO
        });

        it('should contain a value object', () => {
            const values = hearingSupport.values();
            expect(values).to.eql( { hearing: { wantsSupport: false } });
        });

    });

    describe('answers()', () => {

        it('should contain hide index which is set to true', () => {
            const answers = hearingSupport.answers();
            expect(answers.hide).to.equal(true);
        });

    });

    describe('next()', () => {

        it('returns branch object where condition nextStep equals /arrangements', () => {
            const nextStep = hearingSupport.next().branches[0].redirector.nextStep;
            expect(nextStep).to.eq(paths.hearing.hearingArrangements);

        });

        it('returns fallback object where nextStep equals /hearing-availability', () => {
            const nextStep = hearingSupport.next().fallback.nextStep;
            expect(nextStep).to.eq(paths.hearing.hearingAvailability);
        });

    });

});
