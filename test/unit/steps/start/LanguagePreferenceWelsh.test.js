// eslint-disable-next-line max-len
const LanguagePreferenceWelsh = require('steps/start/language-preference-welsh/LanguagePreferenceWelsh');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('LanguagePreferenceWelsh.js', () => {
  let languagePreferenceWelsh = null;

  beforeEach(() => {
    languagePreferenceWelsh = new LanguagePreferenceWelsh({
      journey: {
        steps: {
          AppealFormDownload: paths.appealFormDownload
        }
      }
    });
    languagePreferenceWelsh.fields = { languagePreferenceWelsh: {} };
  });

  describe('get path()', () => {
    it('returns path /language-preference-welsh', () => {
      expect(LanguagePreferenceWelsh.path).to.equal(paths.start.languagePreferenceWelsh);
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      languagePreferenceWelsh.content = { cya: { languagePreferenceWelsh: { question } } };
    });
  });

  // eslint-disable-next-line no-empty-function
  describe('next()', () => {});
});
