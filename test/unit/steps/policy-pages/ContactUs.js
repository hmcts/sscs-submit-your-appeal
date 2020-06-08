const { expect } = require('test/util/chai');
const ContactUs = require('steps/policy-pages/ContactUs');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('ContactUs.js', () => {
  describe('get path()', () => {
    it('returns path /contact-us', () => {
      expect(ContactUs.path).to.equal(paths.policy.contactUs);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const cantAppeal = new ContactUs({
        journey: {}
      });

      expect(cantAppeal.middleware).to.be.an('array');
      expect(cantAppeal.middleware).to.have.length(6);
      expect(cantAppeal.middleware).to.include(checkWelshToggle);
    });
  });
});
