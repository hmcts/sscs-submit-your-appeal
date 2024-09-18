async function selectDoYouWantToReceiveTextMessageReminders(page, commonContent, option) {
  await page.locator(option).first().check();
  await page.click(commonContent.continue);
}

module.exports = { selectDoYouWantToReceiveTextMessageReminders };
