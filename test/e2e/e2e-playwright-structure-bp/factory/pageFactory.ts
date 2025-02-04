import { Page } from '@playwright/test';
import {
    AppellantInMainlandUkPage,
    IndependencePage,
    CreateAccountPage,
    ReviewDecisionNotice,
    IbcaReferenceNumberPage,
    IbcaReferenceDatePage,
    EnterAppellantRolePage,
    EnterAppellantNamePage,
    AppellantDobPage,
    AppellantTextRemindersPage,
    RepresentativePage,
    ReasonsForAppealPage,
    TheHearingPage,
    OtherReasonsForAppealPage,
    EvidenceProvidePage,
    CheckYourAppealPage,
    LanguagePreferencePage,
    AppellantContactDetailsPage,
    ConfirmationPage,
    IbcaReferenceLateDatePage,
    IbcaReferenceLateDateReasonPage
} from '../pages';

export class PageFactory {
    static async getAllPages(page: Page) {
        const pages = {
            'appellantInMainlandUkPage': new AppellantInMainlandUkPage(page),
            'independencePage': new IndependencePage(page),
            'createAccountPage': new CreateAccountPage(page),
            'reviewDecisionNoticePage': new ReviewDecisionNotice(page),
            'ibcaRefNumPage': new IbcaReferenceNumberPage(page),
            'ibcaReferenceDatePage': new IbcaReferenceDatePage(page),
            'ibcaReferenceLateDatePage': new IbcaReferenceLateDatePage(page),
            'ibcaReferenceLateDateReasonPage': new IbcaReferenceLateDateReasonPage(page),
            'enterAppellantRolePage': new EnterAppellantRolePage(page),
            'enterAppellantNamePage': new EnterAppellantNamePage(page),
            'appellantContactDetailsPage': new AppellantContactDetailsPage(page),
            'appellantDobPage': new AppellantDobPage(page),
            'appellantTextRemindersPage': new AppellantTextRemindersPage(page),
            'representativePage': new RepresentativePage(page),
            'reasonsForAppealPage': new ReasonsForAppealPage(page),
            'otherReasonsForAppealPage': new OtherReasonsForAppealPage(page),
            'evidenceProvidePage': new EvidenceProvidePage(page),
            'theHearingPage': new TheHearingPage(page),
            'checkYourAppealPage': new CheckYourAppealPage(page),
            'languagePreferencePage': new LanguagePreferencePage(page),
            'confirmationPage': new ConfirmationPage(page),
        };
        return pages;
    }
}
