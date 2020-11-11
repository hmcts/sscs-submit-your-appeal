/* eslint-disable camelcase */
/* eslint-disable no-undef */
const Helper = codecept_helper;

class MyHelper extends Helper {
  _before() {
    const helper = this.helpers.Puppeteer;
    return helper.wait(20);
  }

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
}

module.exports = MyHelper;
