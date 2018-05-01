const { expect } = require('test/util/chai');
const ContactDWP = require('steps/compliance/contact-dwp/ContactDWP');
const paths = require('paths');

describe('ContactDWP.js', () => {
  describe('get path()', () => {
    it('returns path /contact-dwp', () => {
      expect(ContactDWP.path).to.equal(paths.compliance.contactDWP);
    });
  });
});
