function createTheSession(language, url = '') {
  const I = this;
  if (url === '') {
    I.amOnPage(`/entry?lng=${language}`, `to create a session in ${language.toUpperCase()}`);
  } else {
    const destinationURL = url.replace(/^https:\/\//, 'https://iba-');
    I.amOnPage(`${destinationURL}/entry?lng=${language}`, `to create a session in ${language.toUpperCase()}`);
  }
}

module.exports = { createTheSession };
