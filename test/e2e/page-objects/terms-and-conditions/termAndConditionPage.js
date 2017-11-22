function seeGivenRelatedLink(relatedLinkText, relatedLinkUrl) {

    const I = this;

    I.see(relatedLinkText);
    I.click(relatedLinkText);
    I.seeInCurrentUrl(relatedLinkUrl);

}

module.exports = { seeGivenRelatedLink };
