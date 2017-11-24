'use strict';

const { expect } = require('test/util/chai');
const Confirmation = require('steps/confirmation/Confirmation');
const paths = require('paths');

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

});
