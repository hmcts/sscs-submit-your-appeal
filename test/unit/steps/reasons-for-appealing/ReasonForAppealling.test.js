'use strict';

const ReasonForAppealing = require('steps/reasons-for-appealing/reason-for-appealing/ReasonForAppealing');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('ReasonForAppealing.js', () => {

    let reasonForAppealing;

    beforeEach(() => {

        reasonForAppealing = new ReasonForAppealing({
            journey: {
                steps: {
                    OtherReasonForAppealing: paths.reasonsForAppealing.otherReasonForAppealing
                }
            }
        });

        reasonForAppealing.fields = {};

    });

    describe('get path()', () => {

        it('returns path /reason-for-appealing', () => {
            expect(ReasonForAppealing.path).to.equal(paths.reasonsForAppealing.reasonForAppealing);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = reasonForAppealing.form.fields;
        });

        describe('reasonForAppealing field', () => {

            beforeEach(() => {
                field = fields[0];
            });

            it('contains the field name reasonForAppealing', () => {
                expect(field.name).to.equal('reasonForAppealing');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('get answers()', () => {

        beforeEach(() => {

            reasonForAppealing.fields = {
                reasonForAppealing: {
                    value: "my answer"
                }
            };

            reasonForAppealing.content = {
                cya: {
                    reasonForAppealing: {
                        question: 'my question'
                    }
                }
            };

        });

        it('should return expected section', () => {
            expect(reasonForAppealing.answers()[0].section).to.eql('reasons-for-appealing');
        });

        it('should return expected answer', () => {
            expect(reasonForAppealing.answers()[0].answer).to.eql('my answer');
        });

        it('should return expected question', () => {
            expect(reasonForAppealing.answers()[0].question).to.eql('my question');
        });

    });

    describe('next()', () => {

        it('returns the next step path /appellant-text-reminders', () => {
            expect(reasonForAppealing.next()).to.eql({ nextStep: paths.reasonsForAppealing.otherReasonForAppealing });
        });

    });

});
