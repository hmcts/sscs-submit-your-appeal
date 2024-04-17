function createNewApplication(language) {
  const I = this;

  I.seeElement(".form-buttons-group [href='/new-appeal']");
  if (language === 'en') {
    I.waitForText('Your draft benefit appeals');
    I.click('Create new application');
  } else {
    I.waitForText('Drafft o’ch apeliadau ynghylch budd-daliadau');
    I.click('Creu cais newydd');
  }
}

module.exports = { createNewApplication };