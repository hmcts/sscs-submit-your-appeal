function enterAnMRNDateAndContinue(commonContent, date) {
  const I = this;

  I.scrollPageToBottom();
  I.wait(1);
  I.fillField('input[name*="day"]', date.date().toString());
  I.fillField('input[name*="month"]', (date.month() + 1).toString());
  I.fillField('input[name*="year"]', date.year().toString());
  I.waitForClickable(commonContent.continue, 3)
  I.click(commonContent.continue);
}

function enterAnMRNDateAndContinueAfterSignIn(commonContent, date) {
  const I = this;

  I.scrollPageToBottom();
  I.wait(1);
  I.fillField('input[name*="day"]', date.date().toString());
  I.fillField('input[name*="month"]', (date.month() + 1).toString());
  I.fillField('input[name*="year"]', date.year().toString());
  I.waitForClickable(commonContent.continue, 3)
  I.click(commonContent.saveAndContinue);
}

module.exports = { enterAnMRNDateAndContinue, enterAnMRNDateAndContinueAfterSignIn };
