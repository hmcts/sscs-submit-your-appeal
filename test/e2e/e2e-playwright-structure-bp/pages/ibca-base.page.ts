import { Page } from '@playwright/test';
const dateUtil = require('utils/DateUtils');


export class BasePage {
    baseUrl: any;
    constructor(protected page: Page) {
        this.page = page;
        this.baseUrl = 'https://infected-blood-appeal.aat.platform.hmcts.net';
    }
    async goto(relativeUrl: string) {
        let sscsUrl = `${this.baseUrl}/${relativeUrl}`;
        await this.page.goto(sscsUrl);
    }

    async enterDate(language: string) {
        const date = dateUtil.oneMonthAgo(language);
        await this.page.getByRole('textbox', { name: 'Day' }).fill(date.date().toString());
        await this.page.getByRole('textbox', { name: 'Month' }).fill((date.month() + 1).toString());
        await this.page.getByRole('textbox', { name: 'Year' }).fill(date.year().toString());
        await this.submitPage();
    }

    async submitPage(buttonName: string = 'Continue') {
        await this.page.getByRole('button', { name: buttonName }).click();
    }
}