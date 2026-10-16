// Ensure i18next exposes a default .language property so tests that stub it can work
const i18next = require('i18next');

if (typeof i18next.language === 'undefined') {
  // default to English
  i18next.language = 'en';
}

// Some test code calls i18next.changeLanguage directly; if i18next hasn't been
// fully initialised this can throw. Wrap the existing changeLanguage to fall
// back to a simple setter that returns a resolved Promise and invokes a
// callback if provided.
const origChangeLanguage = i18next.changeLanguage;

function changeLanguage(lang, ...args) {
  // accept an optional callback as the last argument
  const lastArg = args.length ? args[args.length - 1] : undefined;
  try {
    if (typeof origChangeLanguage === 'function') {
      // Try the original implementation first
      return origChangeLanguage.call(this, lang, ...args);
    }
  } catch {
    // fall through to fallback
  }
  // fallback: set language and invoke callback/promise
  i18next.language = lang;
  if (typeof lastArg === 'function') {
    try {
      lastArg(null, true);
    } catch {
      // ignore callback errors
    }
  }
  return Promise.resolve();
}

i18next.changeLanguage = changeLanguage;

module.exports = i18next;
