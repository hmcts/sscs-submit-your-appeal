import { BasePage } from './ibca-base.page';

export class TheHearingPage extends BasePage {
    async preferHearing(option: boolean) {
        if (option) { //ToDO: Attend hearing path
            await this.page.getByText('I prefer a hearing that I take part either in person, by video or by phone').click();
        } else { //Not attending Hearing Path
            await this.page.getByText('I prefer a ‘paper hearing’ where I do not take part, decided on documents and information provided').click();
            await this.submitPage();
            await this.submitPage(); // Not Attending Hearing Path
        }
    }
}