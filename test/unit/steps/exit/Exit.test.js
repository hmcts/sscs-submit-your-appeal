'use strict';

const { expect } = require('test/util/chai');
const Exit = require('steps/exit/Exit');
const paths = require('paths');

describe('Exit.js', () => {

    let exit;

    beforeEach(() => {

        exit = new Exit({ journey: {} });

    });

    describe('get path()', () => {

        it('returns path /exit', () => {
            expect(Exit.path).to.equal(paths.session.exit);
        });

    });

});
