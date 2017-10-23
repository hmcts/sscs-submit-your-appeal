'use strict';

const { expect } = require('test/util/chai');
const NoMRN = require('steps/compliance/no-mrn/NoMRN');
const paths = require('paths');

describe('NoMRN.js', () => {

    let noMRNClass;

    beforeEach(() => {
        noMRNClass = new NoMRN();
    });

    after(() => {
        noMRNClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /no-mrn', () => {
            expect(noMRNClass.url).to.equal(paths.compliance.noMRN);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = noMRNClass.form.fields[0];
        });

        after(() => {
            field = undefined;
        });

        it('contains the field name reasonForNoMRN', () => {
            expect(field.name).to.equal('reasonForNoMRN');
        });

    });

    describe('next()', () => {

        it('returns the next step url /are-you-an-appointee', () => {
            const redirector = {
                nextStep: '/are-you-an-appointee'
            };
            noMRNClass.journey = {
                Appointee: '/are-you-an-appointee'
            };
            expect(noMRNClass.next()).to.eql(redirector);
        });

    });

});
