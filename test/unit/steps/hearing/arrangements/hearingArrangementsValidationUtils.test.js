const { expect } = require('test/util/chai');
const {
  languageInList,
  emptyLanguageFieldValidation,
  validCharacters,
  optionSelected
} = require('steps/hearing/arrangements/hearingArrangementsValidationUtils');
const languages = require('steps/hearing/arrangements/languages');

describe('hearingArrangementsValidationUtils.js', () => {
  const value = {};

  beforeEach(() => {
    value.requested = true;
    value.language = undefined;
  });

  describe('languageInList', () => {
    it('returns true when requested field has not been set', () => {
      value.requested = false;
      expect(languageInList(value)).to.equal(true);
    });

    it('returns true when requested field has been set and language is in the list', () => {
      value.language = languages[0];
      expect(languageInList(value)).to.equal(true);
    });

    it("returns false when requested field has been set but language isn't in the list", () => {
      value.language = 'My language';
      expect(languageInList(value)).to.equal(false);
    });
  });

  describe('emptyLanguageFieldValidation', () => {
    it('returns true when requested field has not been set', () => {
      value.requested = false;
      expect(emptyLanguageFieldValidation(value)).to.equal(true);
    });

    it("returns false when requested field has been set but language field hasn't", () => {
      expect(emptyLanguageFieldValidation(value)).to.equal(false);
    });

    it('returns true when requested field has been set and language field has a value', () => {
      value.language = 'Language';
      expect(emptyLanguageFieldValidation(value)).to.equal(true);
    });
  });

  describe('validCharacters', () => {
    it('returns true when requested field has not been set', () => {
      value.requested = false;
      expect(validCharacters(value)).to.equal(true);
    });

    it('should return false, requested field set, language field has invalid characters', () => {
      value.language = '<invalid characters>';
      expect(validCharacters(value)).to.equal(false);
    });

    it('should return true, requested field set, language field has valid characters', () => {
      value.language = 'valid characters';
      expect(validCharacters(value)).to.equal(true);
    });
  });

  describe('optionSelected', () => {
    const options = {
      interpreterLanguage: {},
      signLanguage: {}
    };

    beforeEach(() => {
      options.interpreterLanguage.requested = false;
      options.signLanguage.requested = false;
    });

    it('returns false when a checkbox field has not been set', () => {
      expect(optionSelected(options)).to.equal(false);
    });

    it('returns true when a checkbox field has been set', () => {
      options.signLanguage.requested = true;
      expect(optionSelected(options)).to.equal(true);
    });

    it('returns true when a checkbox field has been set on first iteration of the loop', () => {
      options.interpreterLanguage.requested = true;
      expect(optionSelected(options)).to.equal(true);
    });
  });
});
