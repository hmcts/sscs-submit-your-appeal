import { BasePage } from './ibca-base.page';

export class AppellantInMainlandUkPage extends BasePage {
  defaultPageContent: any = {
    "heading": "Do you live in England, Scotland, Wales or Northern Ireland",
    "bodyContents": []
  };

  async chooseLanguage(language: string) {
    const supportedLanguages: any = {
      'english': 'English only',
      'englishAndWelsh': 'English and Welsh'
    }
    await this.goto('language-preference');
    await this.page.getByText(supportedLanguages[language]).click();
    await this.submitPage();
  }

  async isInCountry(option: boolean) {
    (option) ?
      await this.page.getByText('Yes').click() :
      await this.page.getByText('No').click();
    await this.submitPage();
  }
}
