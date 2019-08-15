const { expect } = require('test/util/chai');
const ContactDWP = require('steps/compliance/contact-dwp/ContactDWP');
const paths = require('paths');
const config = require('config');

describe('ContactDWP.js', () => {
  describe('get path()', () => {
    it('returns path /contact-dwp', () => {
      expect(ContactDWP.path).to.equal(paths.compliance.contactDWP);
    });

    it('get allowUC from config', () => {
      const contactDWP = new ContactDWP({
        journey: {
          steps: {}
        }
      });
      expect(contactDWP.allowUC).to.equal(config.get('features.allowUC.enabled') === 'true');
    });
  });
});
