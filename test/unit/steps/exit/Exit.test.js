'use strict';

const { expect } = require('test/util/chai');
const Exit = require('steps/confirmation/Confirmation');
const urls = require('urls');

describe('Exit.js', () => {

    let exitClass;

    beforeEach(() => {
        exitClass = new Exit();
    });

    after(() => {
        exitClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /exit', () => {
            expect(exitClass.url).to.equal(urls.session.exit);
        });

    });

});
