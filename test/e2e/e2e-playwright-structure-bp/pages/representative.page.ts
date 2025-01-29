import { BasePage } from './ibca-base.page';

export class RepresentativePage extends BasePage {
    async requireLegalRep(option: boolean) {
        (option) ?
            await this.page.getByText('Yes, I want to register a representative').click() :
            await this.page.getByText('No, I don’t want to register a representative').click();
        await this.submitPage();
    }
}