'use strict';

const { expect } = require('test/util/chai');
const NoMRN = require('steps/compliance/no-mrn/NoMRN');
const paths = require('paths');

describe('NoMRN.js', () => {

    let noMRN;

    beforeEach(() => {

        noMRN = new NoMRN({
            journey: {
                steps: {
                    Appointee: '/are-you-an-appointee'
                }
            }
        });

    });

    describe('get path()', () => {

        it('returns path /no-mrn', () => {
            expect(NoMRN.path).to.equal(paths.compliance.noMRN);
        });

    });

    describe('get form()', () => {

        it('contains the field name reasonForNoMRN', () => {
            const field = noMRN.form.fields[0];
            expect(field.name).to.equal('reasonForNoMRN');
        });

    });

    describe('next()', () => {

        it('returns the next step path /are-you-an-appointee', () => {
            expect(noMRN.next()).to.eql({ nextStep: '/are-you-an-appointee' });
        });

    });

});
