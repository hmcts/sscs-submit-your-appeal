import { BasePage } from './ibca-base.page';

export class EvidenceProvidePage extends BasePage {
    async isEvidenceRequired(option: boolean) {
        (option) ?
            await this.page.locator("#evidenceProvide-yes").click() :
            await this.page.locator("#evidenceProvide-no").click();
        await this.submitPage();
    }
}