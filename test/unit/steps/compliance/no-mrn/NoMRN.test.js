'use strict';

const { expect } = require('test/util/chai');
const NoMRN = require('steps/compliance/no-mrn/NoMRN');
const content = require('steps/compliance/no-mrn/content.json');
const urls = require('urls');

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
            expect(noMRNClass.url).to.equal(urls.compliance.noMRN);
        });

    });

    describe('get template()', () => {

        it('returns template path compliance/no-mrn/template', () => {
            expect(noMRNClass.template).to.equal('compliance/no-mrn/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(noMRNClass.i18NextContent).to.equal(content);
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