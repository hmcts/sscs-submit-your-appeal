import { BasePage } from './ibca-base.page';

export class EnterAppellantNamePage extends BasePage {
    async appellantName(firstname: string, lastname: string) {
        await this.page.getByRole('textbox', { name: 'First name' }).fill(firstname);
        await this.page.getByRole('textbox', { name: 'Last name' }).fill(lastname);
        await this.submitPage();
    }
}