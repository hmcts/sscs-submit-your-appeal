const { expect } = require('test/util/chai');
const ContactUsTest = require('steps/policy-pages/contact-us/ContactUs');
const paths = require('paths');

describe('ContactUs.js', () => {
  describe('get path()', () => {
    it('returns path /contact-us', () => {
      expect(ContactUsTest.path).to.equal(paths.policy.contactUs);
    });
  });
});
