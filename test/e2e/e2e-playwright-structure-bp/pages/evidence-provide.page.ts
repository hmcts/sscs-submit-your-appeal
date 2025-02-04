import { BasePage } from './ibca-base.page';

export class EvidenceProvidePage extends BasePage {
  defaultPageContent: any = {
    "heading": "Evidence to support your appeal",
    "bodyContents": [
      "Evidence is any information that supports your appeal such as a letter, written statement or medical report.",
      "You can upload evidence now or post it in after you have submitted your appeal. You’ll receive the address after you’ve submitted your appeal.",
      "You do not need to send or upload your Review Decision Notice because you are appealing online."
    ]
  };

  async isEvidenceRequired(option: boolean) {
    (option) ?
      await this.page.locator("#evidenceProvide-yes").click() :
      await this.page.locator("#evidenceProvide-no").click();
    await this.submitPage();
  }
}
