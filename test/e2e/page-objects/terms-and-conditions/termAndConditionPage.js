const paths = require('paths');

function seeAndGoToGivenLink(relatedLinkText, relatedLinkUrl) {
  

  expect(page.getByText(relatedLinkText)).toBeVisible();
  await page.click(relatedLinkText);
  page.seeInCurrentUrl(relatedLinkUrl);
  page.goto(paths.policy.termsAndConditions);
}

module.exports = { seeAndGoToGivenLink };
