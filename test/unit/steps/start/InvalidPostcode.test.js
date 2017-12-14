'use strict';

const { expect } = require('test/util/chai');
const paths = require('paths');
const InvalidPostcode = require('steps/start/invalid-postcode/InvalidPostcode');

describe('InvalidPostcode.js', () => {

    let invalidPostcode;

    beforeEach(() => {

        invalidPostcode = new InvalidPostcode({
            journey: {}
        });

    });

    describe('get path()', () => {

        it('returns path /invalid-postcode', () => {
            expect(invalidPostcode.path).to.equal(paths.start.invalidPostcode);
        });

    });

});
