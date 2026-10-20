const chai = require('chai');
const { JSDOM } = require('jsdom');
const jQuery = require('jquery');

const expect = chai.expect;

/* eslint-disable init-declarations */
/* eslint-disable no-multi-assign */
/* eslint-disable global-require */
/* eslint-disable no-unused-vars */

describe('language-preference.js', () => {
  let LanguagePreferenceToggle;
  let languagePreferenceToggle;
  let $;

  before(done => {
    const jsdom = new JSDOM(`
      <html>
        <body>
          <input type="radio" name="languagePreferenceWelsh" value="no" id="languagePreferenceWelsh">
          <input type="radio" name="languagePreferenceWelsh" value="yes" id="languagePreferenceWelsh-2">
          <div id="noWelsh" class="govuk-visually-hidden"></div>
        </body>
      </html>
    `);
    const { window } = jsdom;
    const { document } = window;
    global.window = window;
    global.document = document;
    $ = global.jQuery = jQuery(window);
    LanguagePreferenceToggle = require('../../assets/js/language-preference').default;
    languagePreferenceToggle = new LanguagePreferenceToggle();
    done();
  });

  it('should show #noWelsh when "English only" is selected', () => {
    $('#languagePreferenceWelsh').prop('checked', true).trigger('change');
    expect($('#noWelsh').hasClass('govuk-visually-hidden')).to.be.false;
  });

  it('should hide #noWelsh when "yes" is selected', () => {
    $('#languagePreferenceWelsh-2').prop('checked', true).trigger('change');
    expect($('#noWelsh').hasClass('govuk-visually-hidden')).to.be.true;
  });

  it('should return true for startLanguagePreferenceToggle when pathname is /language-preference', () => {
    const { window } = new JSDOM('', {
      url: 'http://localhost/language-preference'
    });
    global.window = window;
    const result = LanguagePreferenceToggle.startLanguagePreferenceToggle();
    expect(result).to.be.true;
  });

  it('should return false for startLanguagePreferenceToggle when pathname is not /language-preference', () => {
    const { window } = new JSDOM('', { url: 'http://localhost/other-path' });
    global.window = window;
    const result = LanguagePreferenceToggle.startLanguagePreferenceToggle();
    expect(result).to.be.false;
  });
});
