import { BasePage } from './ibca-base.page';

export class DraftAppealsPage extends BasePage {
  defaultPageContent: any = {
    heading: 'Your draft appeals',
    bodyContents: [
      'The cases in this list have yet to be submitted to HM Courts & Tribunals Service.',
      'If you wish to edit an application for appeal, please select ‘edit’ next to the appropriate application',
      'If you no longer wish to submit any of these applications for appeal, please select ‘delete’ next to the appropriate application.',
      'If you wish to submit a new appeal, please select ‘create new application’ to provide your appeal information.'
    ]
  };

  async editAppeal() {
    await this.page
      .getByRole('row', { name: 'Infected' })
      .getByRole('link')
      .first()
      .click();
  }

  async archiveAppeal() {
    await this.page
      .getByRole('row', { name: 'Infected' })
      .getByRole('link')
      .last()
      .click();
  }
}
