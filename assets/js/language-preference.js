import $ from 'jquery';

class LanguagePreferenceToggle {
  constructor() {
    this.toggleHintText();
  }

  toggleHintText() {
    $('input[name="languagePreferenceWelsh"]').change(() => {
      if ($('input[name="languagePreferenceWelsh"]:checked').val() === 'no') {
        $('#noWelsh').removeClass('govuk-visually-hidden');
      } else {
        $('#noWelsh').addClass('govuk-visually-hidden');
      }
    });
  }

  static startLanguagePreferenceToggle() {
    return window.location.pathname === '/language-preference';
  }
}

export default LanguagePreferenceToggle;
