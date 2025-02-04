import { BasePage } from './ibca-base.page';

export class CreateAccountPage extends BasePage {
  defaultPageContent: any = {
    "heading": "Do you want to be able to save this appeal later?",
    "bodyContents": [
      "You need to create an account now if you want to save your appeal application later. For example, if you need to take a break or gather information.",
      "If you decide not to create an account now, and leave an appeal part-way through, you will have to start over when you decide to complete an appeal. If you think you will want to save part-way through, then select I want to be able to save this appeal later."
    ]
  };
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
