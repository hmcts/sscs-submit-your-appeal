import { BasePage } from './ibca-base.page';

export class ReasonsForAppealPage extends BasePage {

    async whatDisagreeWith(reason: string) {
        await this.page.getByRole('textbox', { name: 'What you disagree with' }).fill(reason);
    }

    async whyDisagreeWith(reason: string) {
        await this.page.getByRole('textbox', { name: 'Why you disagree with it' }).fill(reason);
    }

    async reasonsForAppealInfo(whatReason: string, whyReason: string) {
        await this.whatDisagreeWith(whatReason);
        await this.whyDisagreeWith(whyReason);
        await this.submitPage();
    }
}