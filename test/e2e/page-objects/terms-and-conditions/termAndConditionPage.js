const termsAndConditionsContent = require('terms-and-conditions-page/content.en.json');

function seeGivenRelatedLink(relatedLinkText, relatedLinkUrl) {

    const I = this;

    I.see(termsAndConditionsContent.relatedLinks.links.cookie.text);
    I.click(termsAndConditionsContent.relatedLinks.links.cookie.text);
    I.seeInCurrentUrl(termsAndConditionsContent.relatedLinks.links.cookie.url);

}

module.exports = { seeGivenRelatedLink };
