import { BasePage } from './ibca-base.page';

export class CheckYourAppealPage extends BasePage {
  defaultPageContent: any = {
    "heading": "Check your answers",
    "bodyContents": [
      "Appeal"
    ]
  };
  
  async signAndSubmitYourAppeal(signer: string) {
    await this.page.getByRole('textbox', { name: 'Enter your name' }).fill(signer);
    await this.submitPage('Submit your appeal');
  }
}
