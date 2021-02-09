function createNewApplication() {
  const I = this;

  I.seeElement(".form-buttons-group [href='/new-appeal']");
  I.see('Your draft benefit appeals');
  I.click('Create new application');
}

module.exports = { createNewApplication };