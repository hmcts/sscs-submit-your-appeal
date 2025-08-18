import { Page } from '@playwright/test';

export class BasePage {
  baseUrl: any;
  language: string = process.env.LANGUAGE_TO_TEST!;
  heading: string = "h1";
  body: string = "#main-content";
  ibcaBaseURL: string;
  constructor(protected page: Page) {
    this.page = page;
    this.ibcaBaseURL = 'https://iba-sscs-tribunals-frontend-pr-1825.preview.platform.hmcts.net';
  }
  async goto(relativeUrl: string = "") {
    let sscsUrl = `${this.ibcaBaseURL}/${relativeUrl}?lng=${this.language}`;
    await this.page.goto(sscsUrl);
  }

  async enterDate(day: number, month: number, year: number) {
    await this.page.getByRole('textbox', { name: 'Day' }).fill(day.toString());
    await this.page.getByRole('textbox', { name: 'Month' }).fill(month.toString());
    await this.page.getByRole('textbox', { name: 'Year' }).fill(year.toString());
    await this.submitPage();
  }

  async getPageHeading() {
    return this.page.locator(this.heading).textContent();
  }

  async getPageContent() {
    return this.page.locator(this.body).textContent();
  }

  async submitPage(buttonName: string = 'Continue') {
    await this.page.getByRole('button', { name: buttonName }).click();
  }
}
