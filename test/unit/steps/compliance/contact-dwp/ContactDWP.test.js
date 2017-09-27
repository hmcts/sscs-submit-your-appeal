'use strict';

const { expect } = require('test/util/chai');
const ContactDWP = require('steps/compliance/contact-dwp/ContactDWP');
const content = require('steps/compliance/contact-dwp/content.json');

describe('ContactDWP.js', () => {

    let contactDWPClass;

    beforeEach(() => {
        contactDWPClass = new ContactDWP();
    });

    after(() => {
        contactDWPClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /contact-dwp', () => {
            expect(contactDWPClass.url).to.equal('/contact-dwp');
        });

    });

    describe('get template()', () => {

        it('returns template path compliance/contact-dwp/template', () => {
            expect(contactDWPClass.template).to.equal('compliance/contact-dwp/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(contactDWPClass.i18NextContent).to.equal(content);
        });

    });

});
