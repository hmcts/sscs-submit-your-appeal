import { BasePage } from './ibca-base.page';

export class ReviewDecisionNotice extends BasePage {
    async reviewDecisionNotice(option: boolean) {
        (option) ?
            await this.page.getByText('Yes, I have a Review Decision Notice').click() :
            await this.page.getByText('No, I don’t have a Review Decision Notice').click();
        await this.submitPage();
    }
}