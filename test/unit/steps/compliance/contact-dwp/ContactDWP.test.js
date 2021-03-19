const { expect } = require('test/util/chai');
const ContactDWP = require('steps/compliance/contact-dwp/ContactDWP');
const paths = require('paths');

describe('ContactDWP.js', () => {
  let contactDWP = null;

  describe('Benefit type present in session', () => {
    beforeEach(() => {
      contactDWP = new ContactDWP({
        journey: {
          steps: {}
        },
        session: {
          BenefitType: {
            benefitType: 'Universal Credit (UC) Universal Credit UC'
          }
        }
      });
    });

    it('returns path /contact-dwp', () => {
      expect(ContactDWP.path).to.equal(paths.compliance.contactDWP);
    });

    it('get benefitType returns a benefit type when present in the session', () => {
      expect(contactDWP.benefitType).to.equal('UC Universal Credit UC');
    });
  });

  describe('Benefit type not present in session', () => {
    it('get benefitType returns a benefit type when present in the session', () => {
      contactDWP = new ContactDWP({
        journey: {
          steps: {}
        },
        session: {}
      });

      expect(contactDWP.benefitType).to.equal('');
    });
  });
});
