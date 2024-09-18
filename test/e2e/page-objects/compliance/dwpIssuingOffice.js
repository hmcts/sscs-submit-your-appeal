function enterDWPIssuingOfficeAndContinue(page, commonContent, id) {
  

  await page.waitForTimeout(3);
  selectOption(page, { id: 'pipNumber' }, id);
  await page.click(commonContent.continue);
}

function enterDWPIssuingOfficeAndContinueAfterSignIn(page, commonContent, id) {
  

  await page.waitForTimeout(3);
  selectOption(page, { id: 'pipNumber' }, id);
  await page.click(commonContent.saveAndContinue);
}

function enterDWPIssuingOffice(page, commonContent, id) {
  

  await page.waitForTimeout(3);
  selectOption(page, { id: 'dwpIssuingOffice' }, id);
  await page.click(commonContent.continue);
}

function seeDWPIssuingOfficeError(url, error) {
  

  page.seeInCurrentUrl(url);
  expect(page.getByText(error)).toBeVisible();
}

module.exports = {
  enterDWPIssuingOfficeAndContinue,
  enterDWPIssuingOfficeAndContinueAfterSignIn,
  enterDWPIssuingOffice,
  seeDWPIssuingOfficeError,
};
