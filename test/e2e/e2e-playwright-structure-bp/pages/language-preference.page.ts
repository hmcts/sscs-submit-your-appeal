import { BasePage } from './ibca-base.page';

export class LanguagePreferencePage extends BasePage {
    defaultPageContent: any = {
        "heading": "What language do you want us to use when we contact you?",
        "bodyContents": [
            "We’ll send you emails and documents as we progress your appeal. Choose which language you’d like these in.",
            "All documents will be in English."
        ]
    };
    async chooseLanguage(language: string) {
        const supportedLanguages: any = {
            "en": "English only",
            "en-cy": "English and Welsh"
        }
        await this.page.getByText(supportedLanguages[language]).click();
        await this.submitPage();
    }
}
