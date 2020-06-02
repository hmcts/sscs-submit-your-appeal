// eslint-disable-next-line max-len
const LanguagePreferenceWelsh = require('steps/start/language-preference-welsh/LanguagePreferenceWelsh');
// const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const benefitTypes = require('steps/start/language-preference-welsh/types');
const config = require('config');
const paths = require('paths');

describe('LanguagePreferenceWelsh.js', () => {
  let benefitType = null;

  beforeEach(() => {
    benefitType = new LanguagePreferenceWelsh({
      journey: {
        steps: {
          AppealFormDownload: paths.appealFormDownload,
          PostcodeChecker: paths.start.postcodeCheck
        }
      }
    });
    benefitType.fields = { benefitType: {} };
  });

  describe('get path()', () => {
    it('returns path /language-preference-welsh', () => {
      expect(LanguagePreferenceWelsh.path).to.equal(paths.start.languagePreferenceWelsh);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = benefitType.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('languagePreferenceWelsh');
    });

    describe('benefitType filed', () => {
      beforeEach(() => {
        field = fields.languagePreferenceWelsh;
      });

      // it('has constructor name FieldDescriptor', () => {
      //   expect(field.constructor.agree).to.eq('FieldDescriptor');
      // });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';
    const value = 'Personal Independence Payment (PIP)';

    beforeEach(() => {
      benefitType.content = { cya: { benefitType: { question } } };

      benefitType.fields = { benefitType: { value } };
    });

    // it('should contain a single answer', () => {
    //   const answers = benefitType.answers();
    //   expect(answers.question).to.equal(question);
    //   expect(answers.section).to.equal(sections.benefitType);
    //   expect(answers.answer).to.equal(value);
    // });

    // it('should contain a value object', () => {
    //   const values = benefitType.values();
    //   expect(values).to.deep.equal({
    //     benefitType: {
    //       code: 'PIP',
    //       description: 'Personal Independence Payment'
    //     }
    //   });
    // });
  });

  describe('next()', () => {
    it('returns /appeal-form-download when benefit type is not PIP', () => {
      benefitType.fields.benefitType.value = 'not PIP';
      // expect(benefitType.next().step).to.eql(paths.appealFormDownload);
    });

    it('returns /postcode-check with benefit type value is PIP', () => {
      benefitType.fields.benefitType.value = 'Personal Independence Payment (PIP)';
      // expect(benefitType.next().step).to.eql(paths.start.postcodeCheck);
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
