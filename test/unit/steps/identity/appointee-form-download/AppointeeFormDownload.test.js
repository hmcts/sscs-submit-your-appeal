'use strict';

const AppointeeFormDownload = require('steps/identity/appointee-form-download/AppointeeFormDownload');
const {expect} = require('test/util/chai');
const paths = require('paths');

describe('AppointeeFormDownload.js', () => {

    let appointeeFormDownloadSut;

    beforeEach(() => {

        appointeeFormDownloadSut = new AppointeeFormDownload({
            journey: {
                steps: {}
            }
        });
        appointeeFormDownloadSut.fields = {
            benefitType: {}
        }

    });

    describe('get path()', () => {

        it('returns path /appointee-form-download', () => {
            expect(AppointeeFormDownload.path).to.equal(paths.identity.downloadAppointeeForm);
        });

    });

    describe('get benefitType()', () => {

        it('returns correct wording', () => {
            appointeeFormDownloadSut.fields.benefitType.value = 'some benefitType';
            expect(appointeeFormDownloadSut.benefitType).to.equal('some benefitType');
        });

    });

    describe('get form()', () => {

        it('should contain 1 fields', () => {
            expect(appointeeFormDownloadSut.form.fields.length).to.equal(1);
        });

        it('should contain a textField reference called \'benefitType\'', () => {
            const textField = appointeeFormDownloadSut.form.fields[0];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('benefitType');
            expect(textField.validations).to.be.empty;
        });

    });

});
