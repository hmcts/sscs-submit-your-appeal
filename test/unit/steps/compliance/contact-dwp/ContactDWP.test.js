'use strict';

const { expect } = require('test/util/chai');
const ContactDWP = require('steps/compliance/contact-dwp/ContactDWP');
const paths = require('paths');

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
            expect(contactDWPClass.url).to.equal(paths.compliance.contactDWP);
        });

    });

});
