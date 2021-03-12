const LanguagePreference = require('steps/start/language-preference/LanguagePreference');
const { expect } = require('test/util/chai');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const config = require('config');
const i18next = require('i18next');

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

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      languagePreference.content = {
        cya: {
          languagePreferenceWelsh: {
            question,
            yes: 'Yes',
            no: 'No'
          }
        }
      };

      languagePreference.fields = {
        languagePreferenceWelsh: {}
      };
    });

    it('should set the question and section', () => {
      const answers = languagePreference.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.benefitType);
    });

    describe('English', () => {
      it('should return the correct answer \'English only\' for CYA (English)', () => {
        languagePreference.fields.languagePreferenceWelsh.value = userAnswer.NO;
        const answers = languagePreference.answers();
        expect(answers.answer).to.equal('English only');
      });

      it('should return the correct answer \'English and Welsh\' for CYA (English)', () => {
        languagePreference.fields.languagePreferenceWelsh.value = userAnswer.YES;
        const answers = languagePreference.answers();
        expect(answers.answer).to.equal('English and Welsh');
      });
    });

    describe('Welsh', () => {
      beforeEach(() => {
        i18next.changeLanguage('cy');
      });

      afterEach(() => {
        i18next.changeLanguage('en');
      });

      it('should return the correct answer \'Saesneg yn unig\' for CYA (Welsh)', () => {
        languagePreference.content.cya.languagePreferenceWelsh.no = 'Nac ydw';
        languagePreference.fields.languagePreferenceWelsh.value = userAnswer.NO;
        const answers = languagePreference.answers();
        expect(answers.answer).to.equal('Saesneg yn unig');
      });

      it('should return the correct answer \'Cymraeg a Saesneg\' for CYA (Welsh)', () => {
        languagePreference.content.cya.languagePreferenceWelsh.yes = 'Ydw';
        languagePreference.fields.languagePreferenceWelsh.value = userAnswer.YES;
        const answers = languagePreference.answers();
        expect(answers.answer).to.equal('Cymraeg a Saesneg');
      });
    });

    it('should set hasRepresentative to false', () => {
      languagePreference.fields.languagePreferenceWelsh.value = userAnswer.NO;
      const values = languagePreference.values();
      expect(values).to.eql({ languagePreferenceWelsh: false });
    });

    it('should set hasRepresentative to true', () => {
      languagePreference.fields.languagePreferenceWelsh.value = userAnswer.YES;
      const values = languagePreference.values();
      expect(values).to.eql({ languagePreferenceWelsh: true });
    });

    it('should set hasRepresentative to null', () => {
      languagePreference.fields.languagePreferenceWelsh.value = '';
      const values = languagePreference.values();
      expect(values).to.eql({ languagePreferenceWelsh: null });
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

    it('pushes DLA as allowed benefitType if allowDLA is enabled', () => {
      expect(Object.keys(benefitTypes).includes('disabilityLivingAllowance'))
        .to.eql(config.get('features.allowDLA.enabled') === 'true');
    });

    it('does not push DLA as allowed benefitType when allowDLA is not enabled', () => {
      expect(!Object.keys(benefitTypes).includes('disabilityLivingAllowance'))
        .to.eql(config.get('features.allowDLA.enabled') === 'false');
    });
  });
});
