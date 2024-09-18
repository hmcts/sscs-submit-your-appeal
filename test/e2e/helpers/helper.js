/* eslint-disable camelcase */
/* eslint-disable no-undef */
const myHelper = {
  // async turnOffJsAndReloadThePage() {
  //   const page = this.helpers.Puppeteer.page;
  //   try {
  //     await page.setJavaScriptEnabled(false);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
  async clickNextIfDateNotVisible(page, dateElement) {
    try {
      const hasDate = Boolean(await page.locator(dateElement).isVisible());
      if (!hasDate) page.click('.next');
    } catch (error) {
      throw new Error(error);
    }
  }
};

module.exports = myHelper;
