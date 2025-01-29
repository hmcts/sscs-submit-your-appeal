import { BasePage } from './ibca-base.page';

export class LanguagePreferencePage extends BasePage {
    async chooseLanguage(language: string) {

        const supportedLanguages: any = {
            'english': 'English only',
            'englishAndWelsh': 'English and Welsh'
        }
        await this.goto('language-preference');
        await this.page.getByText(supportedLanguages[language]).click();
        await this.submitPage();
    }
}