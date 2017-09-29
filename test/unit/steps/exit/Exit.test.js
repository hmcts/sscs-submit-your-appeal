'use strict';

const { expect } = require('test/util/chai');
const Exit = require('steps/exit/Exit');
const content = require('steps/exit/content.json');
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

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(exitClass.i18NextContent).to.equal(content);
        });

    });

});