import { BasePage } from './ibca-base.page';

export class CreateAccountPage extends BasePage {
    async saveForLater(saveOption: boolean) {

        if (saveOption) {
            await this.page.getByText('I want to be able to save this appeal later').click();
        }
        else {
            await this.page.getByText('I do not want to be able to save this appeal later').click();
        }
        await this.submitPage();
    }
}