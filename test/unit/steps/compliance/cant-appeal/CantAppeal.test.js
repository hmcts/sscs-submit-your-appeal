'use strict';

const { expect } = require('test/util/chai');
const CantAppeal = require('steps/compliance/cant-appeal/CantAppeal');
const content = require('steps/compliance/cant-appeal/content.json');

describe('CantAppeal.js', () => {

    let cantAppealClass;

    beforeEach(() => {
       cantAppealClass = new CantAppeal;
    });

    after(() => {
       cantAppealClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /cant-appeal', () => {
            expect(cantAppealClass.url).to.equal('/cant-appeal');
        });

    });

    describe('get template()', () => {

        it('returns template path compliance/cant-appeal/template', () => {
            expect(cantAppealClass.template).to.equal('compliance/cant-appeal/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(cantAppealClass.i18NextContent).to.equal(content);
        });

    });

});