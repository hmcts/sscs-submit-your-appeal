import { BasePage } from './ibca-base.page';

export class IbcaReferenceNumberPage extends BasePage {
    async enterReferenceNumber(refNum: string) {
        await this.page.getByRole('textbox', { name: 'IBCA Reference number' }).fill(refNum);
        await this.submitPage();
    }
}