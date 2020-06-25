const LanguagePreference = require('steps/start/language-preference/LanguagePreference');
const { expect } = require('test/util/chai');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const config = require('config');

describe('LanguagePreference.js', () => {
  let languagePreference = null;

  beforeEach(() => {
    languagePreference = new LanguagePreference({
      journey: {
        steps: {
          AppealFormDownload: paths.appealFormDownload,
          PostcodeChecker: paths.start.postcodeCheck
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
    it('returns /appeal-form-download when benefit type is not PIP', () => {
      languagePreference.req.session = {
        BenefitType: {
          benefitType: 'not PIP'
        }
      };
      expect(languagePreference.next().step).to.eql(paths.appealFormDownload);
    });

    it('returns /postcode-check with benefit type value is PIP', () => {
      languagePreference.req.session = {
        BenefitType: {
          benefitType: 'Personal Independence Payment (PIP)'
        }
      };
      expect(languagePreference.next().step).to.eql(paths.start.postcodeCheck);
    });

    it('pushes ESA as allowed benefitType if allowESA is enabled', () => {
      expect(Object.keys(benefitTypes).includes('employmentAndSupportAllowance'))
        .to.eql(config.get('features.allowESA.enabled') === 'true');
    });

    it('pushes UC as allowed benefitType if allowUC is enabled', () => {
      expect(Object.keys(benefitTypes).includes('universalCredit'))
        .to.eql(config.get('features.allowUC.enabled') === 'true');
    });
  });
});
