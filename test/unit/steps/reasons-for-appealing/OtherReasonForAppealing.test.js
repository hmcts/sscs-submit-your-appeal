'use strict';

const OtherReasonForAppealing = require('steps/reasons-for-appealing/other-reasons-for-appealing/OtherReasonForAppealing');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('OtherReasonForAppealing.js', () => {

    let otherReasonForAppealing;

    beforeEach(() => {
        otherReasonForAppealing = new OtherReasonForAppealing({
            journey: {
                steps: {
                    SendingEvidence: paths.reasonsForAppealing.sendingEvidence
                }
            }
        });

        otherReasonForAppealing.fields = {
            otherReasonForAppealing: {}
        }
    });

    describe('get path()', () => {

        it('returns path /other-reason-for-appealing', () => {
            expect(otherReasonForAppealing.path).to.equal(paths.reasonsForAppealing.otherReasonForAppealing);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = otherReasonForAppealing.form.fields
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('otherReasonForAppealing');
        });

        describe('otherReasonForAppealing field', () => {

            beforeEach(() => {
                field = fields.otherReasonForAppealing;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name otherReasonForAppealing', () => {
                expect(field.name).to.equal('otherReasonForAppealing');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers() and values()', () => {

        const question = 'A Question';
        const value = 'Reason';

        beforeEach(() => {

            otherReasonForAppealing.content = {
                cya: {
                    otherReasonForAppealing: {
                        question
                    }
                }
            };

            otherReasonForAppealing.fields.otherReasonForAppealing.value = value;

        });

        it('should contain a single answer', () => {
            const answers = otherReasonForAppealing.answers();
            expect(answers.length).to.equal(1);
            expect(answers[0].question).to.equal(question);
            expect(answers[0].section).to.equal(sections.reasonsForAppealing);
            expect(answers[0].answer).to.equal(value);
        });

        it('should contain a value object', () => {
            const values = otherReasonForAppealing.values();
            expect(values).to.eql( { reasonsForAppealing: { otherReasons: value } });
        });
    });

    describe('next()', () => {

        it('returns the next step path /sending-evidence', () => {
            expect(otherReasonForAppealing.next().step).to.eq(paths.reasonsForAppealing.sendingEvidence);

        });

    });

});
