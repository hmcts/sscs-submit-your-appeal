'use strict';

const paths = require('paths');
const termsAndConditionsContent = require('terms-and-conditions-page/content.en.json');

Feature('Terms and Conditions Page');

Before((I) => {
	I.amOnPage(paths.termsAndConditions);
});

Scenario('When I go to the Terms And Conditions page, I see the Term and Conditions section', (I) => {

	I.seeElement('.link-back');
	I.see(termsAndConditionsContent.title);
	I.see(termsAndConditionsContent.termsAndConditions.termsOfuse);
	I.see('These include the GOV.UK privacy policy and terms and conditions.');
	I.click('privacy policy');
	I.seeInCurrentUrl('https://www.gov.uk/help/privacy-policy');
	I.amOnPage(paths.termsAndConditions);
	I.click('terms and conditions');
	I.seeInCurrentUrl('https://www.gov.uk/help/terms-conditions');

});

Scenario('When I go to the Terms And Conditions page, I see the Related links section', (I) => {

	I.see(termsAndConditionsContent.relatedLinks.title);
    I.seeGivenRelatedLink(termsAndConditionsContent.relatedLinks.links.cookie.text,
        termsAndConditionsContent.relatedLinks.links.cookie.url);
    I.amOnPage(paths.termsAndConditions);
    I.seeGivenRelatedLink(termsAndConditionsContent.relatedLinks.links.privacy.text,
        termsAndConditionsContent.relatedLinks.links.privacy.url);
    I.amOnPage(paths.termsAndConditions);
    I.seeGivenRelatedLink(termsAndConditionsContent.relatedLinks.links.conditions.text,
        termsAndConditionsContent.relatedLinks.links.conditions.url);

});

Scenario('When I go to the Terms And Conditions page, I see the Who we are section', (I) => {

	I.see(termsAndConditionsContent.whoWeAre.title);
	I.see(termsAndConditionsContent.whoWeAre.managedBy);
	I.see(termsAndConditionsContent.whoWeAre.changeInLaw);

});

Scenario('When I go to the Terms And Conditions page, I see the Information provided by this service section', (I) => {

	I.see(termsAndConditionsContent.informationProvided.title);
	I.see(termsAndConditionsContent.informationProvided.support);
	I.see(termsAndConditionsContent.informationProvided.questions);

});

Scenario('When I go to the Terms And Conditions page, I see the Where your data is stored section', (I) => {

	I.see(termsAndConditionsContent.dataStored.title);
	I.see(termsAndConditionsContent.dataStored.dataCentres);
	I.see(termsAndConditionsContent.dataStored.notify);

});

Scenario('When I go to the Terms And Conditions page, I see the Who we share your data with section', (I) => {

	I.see(termsAndConditionsContent.shareYourData.title);
	I.see(termsAndConditionsContent.shareYourData.dwp);
	I.see(termsAndConditionsContent.shareYourData.representative);

});

Scenario('When I go to the Terms And Conditions page, I see the Applicable law section', (I) => {

	I.see(termsAndConditionsContent.applicableLaw.title);
	I.see(termsAndConditionsContent.applicableLaw.law);
	I.see(termsAndConditionsContent.applicableLaw.misuse);
	I.see(termsAndConditionsContent.applicableLaw.data);
	I.see(termsAndConditionsContent.applicableLaw.mental);

});

Scenario('When I go to the Terms And Conditions page, I see the Responsible Use of this service section', (I) => {

	I.see(termsAndConditionsContent.responsibleUse.title);
	I.see(termsAndConditionsContent.responsibleUse.designedFor);
	I.see(termsAndConditionsContent.responsibleUse.risks);
	I.see(termsAndConditionsContent.responsibleUse.precautions);
	I.see(termsAndConditionsContent.responsibleUse.viruses);
	I.see(termsAndConditionsContent.responsibleUse.malicious);
	I.see(termsAndConditionsContent.responsibleUse.interference);
	I.see(termsAndConditionsContent.responsibleUse.mustNot);
	I.see(termsAndConditionsContent.responsibleUse.freeText);

});

Scenario('When I go to the Terms And Conditions page, I see the Changes to these terms and conditions section', (I) => {

	I.see(termsAndConditionsContent.changes.title);
	I.see(termsAndConditionsContent.changes.check);
	I.see(termsAndConditionsContent.changes.agree);

});
