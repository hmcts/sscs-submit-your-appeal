import { BasePage } from './ibca-base.page';

export class ReasonsForAppealPage extends BasePage {
  defaultPageContent: any = {
    heading: 'Your reasons for appealing',
    bodyContents: [
      'IBCA should have explained their decision on your Infected Blood Compensation claim in the Review Decision Notice they sent you.\nRead your Review Decision Notice and write what you disagree with and why. Your reasons will be considered by an independent tribunal who are separate from IBCA.'
    ]
  };

  async whatDisagreeWith(reason: string) {
    await this.page
      .getByRole('textbox', { name: 'What you disagree with' })
      .fill(reason);
  }

  async whyDisagreeWith(reason: string) {
    await this.page
      .getByRole('textbox', { name: 'Why you disagree with it' })
      .fill(reason);
  }

  async reasonsForAppealInfo(whatReason: string, whyReason: string) {
    await this.whatDisagreeWith(whatReason);
    await this.whyDisagreeWith(whyReason);
    await this.submitPage();
  }
}
