const paths = require('paths');

function seeAndGoToGivenLink(relatedLinkText, relatedLinkUrl) {

    const I = this;

    I.see(relatedLinkText);
    I.click(relatedLinkText);
    I.seeInCurrentUrl(relatedLinkUrl);
    I.amOnPage(paths.policy.termsAndConditions);

}

module.exports = { seeAndGoToGivenLink };
