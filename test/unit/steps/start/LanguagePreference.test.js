const LanguagePreference = require('steps/start/language-preference/LanguagePreference');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('LanguagePreference.js', () => {
  let languagePreference = null;

  beforeEach(() => {
    languagePreference = new LanguagePreference({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });
    languagePreference.fields = { languagePreference: {} };
  });

  describe('get path()', () => {
    it('returns path /language-preference', () => {
      expect(LanguagePreference.path).to.equal(paths.start.languagePreference);
    });
  });

  describe('answers()', () => {
    it('should be hidden', () => {
      expect(languagePreference.answers().hide).to.be.true;
    });
  });

  describe('values()', () => {
    it('should be empty', () => {
      expect(languagePreference.values()).to.be.empty;
    });
  });

  describe('next()', () => {
    it('returns the next step path /benefit-type', () => {
      expect(languagePreference.next())
        .to.eql({ nextStep: paths.start.benefitType });
    });
  });
});
