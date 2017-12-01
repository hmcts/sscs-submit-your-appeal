'use strict';

const { expect } = require('test/util/chai');
const Appointee = require('steps/identity/appointee/Appointee');
const paths = require('paths');
const answer = require('utils/answer');

describe('Appointee.js', () => {

    let appointeeClass;

    beforeEach(() => {

        appointeeClass = new Appointee({
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

        let field;

        beforeEach(() => {
            field = appointeeClass.form.fields[0];
        });

        after(() => {
            field = undefined;
        });

        it('contains the field name appointee', () => {
            expect(field.name).to.equal('appointee');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step path /appointee-form-download', () => {
            const nextStep = appointeeClass.next().branches[0].redirector.nextStep;
            expect(nextStep).to.eq(paths.identity.downloadAppointeeForm);
        });

        it('returns the next step path /enter-appellant-name', () => {
            const nextStep = appointeeClass.next().fallback.nextStep;
            expect(nextStep).to.eq(paths.identity.enterAppellantName);
        });

    });

});
