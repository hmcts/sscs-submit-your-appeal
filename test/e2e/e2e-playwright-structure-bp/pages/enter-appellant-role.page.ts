import { BasePage } from './ibca-base.page';

export class EnterAppellantRolePage extends BasePage {
  defaultPageContent: any = {
    heading: 'What is your role in this appeal?',
    bodyContents: []
  };

  async appellantRole(role: string) {
    await this.page.getByText(role).click();
    await this.submitPage();
  }
}
