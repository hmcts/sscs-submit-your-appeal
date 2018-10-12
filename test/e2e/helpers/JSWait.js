/* eslint-disable no-undef, camelcase */
class JSWait extends codecept_helper {
  _afterStep() {
    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;

    return helper.waitForElement('#content', 10);
  }
}

module.exports = JSWait;