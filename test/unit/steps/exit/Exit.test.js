'use strict';

const { expect } = require('test/util/chai');
const Exit = require('steps/exit/Exit');
const paths = require('paths');

describe('Exit.js', () => {

    let exit;

    beforeEach(() => {

        exit = new Exit({ journey: {} });

    });

    describe('get url()', () => {

        it('returns url /exit', () => {
            expect(exit.url).to.equal(paths.session.exit);
        });

    });

});
