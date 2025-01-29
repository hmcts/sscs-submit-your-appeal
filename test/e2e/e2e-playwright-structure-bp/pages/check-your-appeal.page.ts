import { BasePage } from './ibca-base.page';

export class CheckYourAppealPage extends BasePage {
    async checkYourAppeal(content: string) { //ToDo : Verify Content
        await this.page.getByRole('textbox', { name: 'Enter your name' }).fill(content);
        await this.submitPage('Submit your appeal');
    }
}
