'use strict';

const { expect } = require('test/util/chai');
const CheckYourAppeal = require('steps/check-your-appeal/CheckYourAppeal');
const urls = require('urls');

describe('CheckYourAppeal.js', () => {

    let checkYourAppealClass;

    beforeEach(() => {
        checkYourAppealClass = new CheckYourAppeal();
        checkYourAppealClass.journey = {};
    });

    describe('get url()', () => {

        it('returns url /check-your-appeal', () => {
            expect(checkYourAppealClass.url).to.equal(urls.checkYourAppeal);
        });

    });

    describe('get form()', () => {

        it('should be defined', () => {
            expect(checkYourAppealClass.form).to.be.undefined;
        });

    });

    describe('next()', () => {

        it('returns the next step url /confirmation', () => {
            checkYourAppealClass.journey.Confirmation = urls.confirmation;
            expect(checkYourAppealClass.next()).to.eql({ nextStep: urls.confirmation});
        });

    });

});
