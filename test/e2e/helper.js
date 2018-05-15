/* eslint-disable camelcase */
/* eslint-disable no-undef */
const Helper = codecept_helper;

class MyHelper extends Helper {
  async createSessionWithJsOff() {
    const browser = this.helpers.Puppeteer.browser;
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.goto(`${this.config.url}/entry`);
    await page.waitForSelector('body');
  }

  async endTheSessionWithJsOff() {
    const browser = this.helpers.Puppeteer.browser;
    const currentPage = await this.getCurrentPage();
    await currentPage.close();
    await browser.close();
  }

  async goToPage(url) {
    const currentPage = await this.getCurrentPage();
    await currentPage.goto(`${this.config.url}${url}`);
    await currentPage.waitForSelector('body');
  }

  async enterDateCantAttendWithoutJs(date, link) {
    const currentPage = await this.getCurrentPage();
    await currentPage.waitForSelector('.add-another-add-link');
    await currentPage.click(link);
    await currentPage.waitForSelector('.form-group-day input');
    await currentPage.$eval(
      '.form-group-day input', (el, value) => (el.value = value), date.date()
    );
    await currentPage.$eval(
      '.form-group-month input', (el, value) => (el.value = value), date.month() + 1
    );
    await currentPage.$eval(
      '.form-group-year input', (el, value) => (el.value = value), date.year()
    );
    await currentPage.click('input[type="submit"');
  }

  async enterValueInField(field, fieldValue) {
    const currentPage = await this.getCurrentPage();
    await currentPage.$eval(field, (el, value) => (el.value = value), fieldValue);
  }

  async selectBenefitType(option) {
    const currentPage = await this.getCurrentPage();
    await currentPage.select('#benefitType', option);
  }

  async getCurrentPage() {
    const browser = this.helpers.Puppeteer.browser;
    const currentPages = await browser.pages();
    return currentPages.find(page => page.url().includes(this.config.url));
  }
}

module.exports = MyHelper;
