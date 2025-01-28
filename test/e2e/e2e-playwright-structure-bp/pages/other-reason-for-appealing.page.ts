import { BasePage } from './ibca-base.page';

export class OtherReasonsForAppealPage extends BasePage {
    defaultPageContent: any = {
        "heading": "Anything else you want to tell the tribunal",
        "bodyContents": [
            "You can tell the tribunal about anything you think may be relevant to your appeal, such as something you feel IBCA didn’t consider in their decision.\nYou don’t have to write anything, if you have nothing further to add."
        ]
    };
    
    async otherReasons(reasons: string) {
        await this.page.getByRole('textbox', { name: 'Other reasons for appealing' }).fill(reasons);
        await this.submitPage();
    }
}
