'use strict';

const { expect } = require('test/util/chai');
const Exit = require('steps/exit/Exit');
const paths = require('paths');

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
            expect(exitClass.url).to.equal(paths.session.exit);
        });

    });

});
