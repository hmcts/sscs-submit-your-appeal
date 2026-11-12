import { BasePage } from './ibca-base.page';

export class IbcaReferenceNumberPage extends BasePage {
  defaultPageContent: any = {
    heading: 'Enter your IBCA Reference number',
    bodyContents: [
      'You can find your IBCA Reference number on your Review Decision Notice.'
    ]
  };

  async enterReferenceNumber(refNum: string) {
    await this.page
      .getByRole('textbox', { name: 'IBCA Reference number' })
      .fill(refNum);
    await this.submitPage();
  }
}
