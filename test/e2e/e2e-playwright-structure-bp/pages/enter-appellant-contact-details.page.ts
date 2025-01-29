import { BasePage } from './ibca-base.page';

export class AppellantContactDetailsPage extends BasePage {
    async enterContactDetails() { //ToDo : Remove Hardcoding
        await this.page.getByRole('textbox', { name: 'Enter a postcode in England,' }).click();
        await this.page.getByRole('textbox', { name: 'Enter a postcode in England,' }).fill('MK56EQ');
        await this.page.getByRole('button', { name: 'Find address' }).click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('networkidle');
        await this.page.getByLabel('Pick an address').selectOption('25019873');
        await this.page.waitForLoadState('networkidle');
        await this.submitPage();
    }
}