'use strict';

const { expect } = require('test/util/chai');
const Appointee = require('steps/identity/appointee/Appointee');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const userAnswer = require('utils/answer');

describe('Appointee.js', () => {

    let appointee;

    beforeEach(() => {

        appointee = new Appointee({
            journey: {
                steps: {
                    AppellantName: paths.identity.enterAppellantName,
                    AppointeeFormDownload: paths.identity.downloadAppointeeForm
                }
            }
        });

    });

    describe('get path()', () => {

        it('returns path /are-you-an-appointee', () => {
            expect(Appointee.path).to.equal(paths.identity.areYouAnAppointee);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = appointee.form.fields;
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('isAppointee');
        });

        describe('isAppointee field', () => {

            beforeEach(() => {
                field = fields.isAppointee;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name isAppointee', () => {
                expect(field.name).to.equal('isAppointee');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers() and values()', () => {

        const question = 'A Question';

        beforeEach(() => {

            appointee.content = {
                cya: {
                    isAppointee: {
                        question
                    }
                }
            };

            appointee.fields = {
                isAppointee: {}
            };

        });

        it('should set the question and section', () => {
            const answers = appointee.answers();
            expect(answers.question).to.equal(question);
            expect(answers.section).to.equal(sections.appellantDetails);
        });

        it('should titleise the users selection to \'No\' for CYA', () => {
            appointee.fields.isAppointee.value = userAnswer.NO;
            const answers = appointee.answers();
            expect(answers.answer).to.equal('No');
        });

        it('should titleise the users selection to \'Yes\' for CYA', () => {
            appointee.fields.isAppointee.value = userAnswer.YES;
            const answers = appointee.answers();
            expect(answers.answer).to.equal('Yes');
        });

        it('should set isAppointee to false', () => {
            appointee.fields.isAppointee.value = userAnswer.NO;
            const values = appointee.values();
            expect(values).to.eql({ isAppointee: false });
        });

        it('hould set isAppointee to true', () => {
            appointee.fields.isAppointee.value = userAnswer.YES;
            const values = appointee.values();
            expect(values).to.eql({ isAppointee: true });
        });
    });

    describe('next()', () => {

        it('returns the next step path /appointee-form-download', () => {
            const nextStep = appointee.next().branches[0].redirector.nextStep;
            expect(nextStep).to.eq(paths.identity.downloadAppointeeForm);
        });

        it('returns the next step path /enter-appellant-name', () => {
            const nextStep = appointee.next().fallback.nextStep;
            expect(nextStep).to.eq(paths.identity.enterAppellantName);
        });

    });

});
