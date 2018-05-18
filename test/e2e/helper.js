/* eslint-disable camelcase */
/* eslint-disable no-undef */
const Helper = codecept_helper;

class MyHelper extends Helper {
  async turnOffJsAndReloadThePage() {
    const page = this.helpers.Puppeteer.page;
    await page.setJavaScriptEnabled(false);
    await page.reload();
  }
}

module.exports = MyHelper;
