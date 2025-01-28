import { BasePage } from './ibca-base.page';

export class TheHearingPage extends BasePage {
    defaultPageContent: any = {
        "heading": "Your hearing preference",
        "bodyContents": [
            "The Tribunal will decide your appeal using the information you give in this appeal form and any further information you send. Information provided by (FTA) will also be considered.",
            "Your appeal could be decided:\nat a hearing you take part in – most hearings are held in person at a tribunal building but you can ask to have the hearing remotely by video or by phone\nas a 'paper hearing' – the tribunal looks at the documents and evidence and makes a decision without you taking part in a hearing",
            "If you take part in a hearing, you can ask for:\nA language interpreter\nReasonable adjustments if you have a health condition or disability\nYou can’t bring your own interpreter to the hearing."
        ]
    };
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
