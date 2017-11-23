'use strict';

const { expect } = require('test/util/chai');
const ContactDWP = require('steps/compliance/contact-dwp/ContactDWP');
const paths = require('paths');

describe('ContactDWP.js', () => {

    let contactDWP;

    beforeEach(() => {
        contactDWP = new ContactDWP({ journey: {} });
    });

    describe('get url()', () => {

        it('returns url /contact-dwp', () => {
            expect(contactDWP.url).to.equal(paths.compliance.contactDWP);
        });

    });

});
