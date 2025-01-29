import { BasePage } from './ibca-base.page';

export class OtherReasonsForAppealPage extends BasePage {

    async otherReasons(reasons: string) {
        await this.page.getByRole('textbox', { name: 'Other reasons for appealing' }).fill(reasons);
        await this.submitPage();
    }
}