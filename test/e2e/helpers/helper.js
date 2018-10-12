/* eslint-disable camelcase */
/* eslint-disable no-undef */
const Helper = codecept_helper;
const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('saucelabs.conf.js');

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
    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;
    try {
      const dateCssSelector = `[data-date="${dateElement}"]`;
      const hasDate = Boolean(await helper.grabNumberOfVisibleElements(dateCssSelector));
      if (!hasDate) {
        logger.info("Can't find date, clicking next...");
        helper.click('.next');
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = MyHelper;
