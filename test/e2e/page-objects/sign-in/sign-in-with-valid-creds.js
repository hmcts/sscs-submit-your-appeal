const paths = require('paths');

function signIn(username, password, language) {
  const I = this;
  I.wait(5);
  I.fillField({ id: 'username' }, username);
  I.fillField({ id: 'password' }, password);
  I.click({ name: 'save' });
  // I.wait(5);
  I.waitForElement(".form-buttons-group [href='/new-appeal']", 20);
  if (language === 'en') {
    I.waitForText('Your draft benefit appeals');
  } else {
    I.waitForText('Drafft o’ch apeliadau ynghylch budd-daliadau');
  }
}

async function signInVerifylanguage(username, password, language) {
  const I = this;
  I.wait(5);
  I.fillField({ id: 'username' }, username);
  I.fillField({ id: 'password' }, password);
  I.click({ name: 'save' });
  I.waitForElement(".form-buttons-group [href='/new-appeal']", 10);
  const altLang = await I.grabTextFrom('.language');
  if ((altLang === 'English' && language === 'en') || (altLang === 'Cymraeg' && language === 'cy')) {
    I.amOnPage(`${paths.drafts}?lng=${language}`);
    I.wait(2);
  }

  if (language === 'en') {
    I.waitForText('Your draft benefit appeals');
  } else {
    I.waitForText('Drafft o’ch apeliadau ynghylch budd-daliadau');
  }
}

function navigateToSignInLink() {
  const I = this;
  I.click('Sign back into your appeal');
  I.wait(2);
}


module.exports = { signIn, signInVerifylanguage, navigateToSignInLink };
