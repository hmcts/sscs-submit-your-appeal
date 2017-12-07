'use strict';

const { expect } = require('test/util/chai');
const DateUtils = require('utils/DateUtils');
const DWPIssuingOffice = require('steps/compliance/dwp-issuing-office/DWPIssuingOffice');
const paths = require('paths');

describe('DWPIssuingOffice.js', () => {

    let dWPIssuingOffice;

    beforeEach(() => {

        dWPIssuingOffice = new DWPIssuingOffice({
            journey: {
                steps: {
                    PostcodeChecker: paths.start.postcodeCheck
                }
            }
        });
    });

    describe('get path()', () => {

        it('returns path /dwp-issuing-office', () => {
            expect(dWPIssuingOffice.path).to.equal(paths.compliance.dwpIssuingOffice);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = dWPIssuingOffice.form.fields;
        });

        describe('pipNumber field', () => {

            beforeEach(() => {

                field = fields[0];
            });

            it('contains the field name pipNumber', () => {
                expect(field.name).to.equal('pipNumber');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });
    });

    describe('next()', () => {

        it('returns the next step path /postcode-check', () => {
            expect(dWPIssuingOffice.next()).to.eql({ nextStep: paths.start.postcodeCheck });
        });

    });

});
