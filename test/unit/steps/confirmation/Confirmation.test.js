'use strict';

const { expect } = require('test/util/chai');
const Confirmation = require('steps/confirmation/Confirmation');
const paths = require('paths');
const urls = require('urls');

describe('Confirmation.js', () => {

    let confirmationClass;

    beforeEach(() => {

        confirmationClass = new Confirmation({ journey: {} });

    });

    describe('get path()', () => {

        it('returns path /confirmation', () => {
            expect(Confirmation.path).to.equal(paths.confirmation);
        });

    });

    describe('get surveyLink()', () => {

        it('returns the smart survey url ', () => {
            expect(confirmationClass.surveyLink).to.equal(urls.surveyLink);
        });

    });

});
