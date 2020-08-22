/* eslint-disable camelcase */
/* eslint-disable no-undef */
const Helper = codecept_helper;

class MyHelper extends Helper {
  async turnOffJsAndReloadThePage() {
    const page = this.helpers.Puppeteer.page;
    try {
      await page.setJavaScriptEnabled(false);
      await page.reload();
    } catch (error) {
      throw new Error(error);
    }
  }

  async clickNextIfDateNotVisible(dateElement) {
    const page = this.helpers.Puppeteer.page;
    try {
      const hasDate = Boolean(await page.$(`[data-date="${dateElement}"]`));
      if (!hasDate) page.click('.next');
    } catch (error) {
      throw new Error(error);
    }
  }

  async isLanguageAvailable(langElement) {
    const page = this.helpers.Puppeteer.page;
    try {
      const hasLanguage = Boolean(await page.$(langElement));
      return hasLanguage;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = MyHelper;
