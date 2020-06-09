const { expect } = require('test/util/chai');
const ContactUsTest = require('steps/policy-pages/contact-us/ContactUs');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('ContactUs.js', () => {
  describe('get path()', () => {
    it('returns path /contact-us', () => {
      expect(ContactUsTest.path).to.equal(paths.policy.contactUs);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const cantAppeal = new ContactUsTest({
        journey: {}
      });

      expect(cantAppeal.middleware).to.be.an('array');
      expect(cantAppeal.middleware).to.have.length(5);
      expect(cantAppeal.middleware).to.include(checkWelshToggle);
    });
  });
});
