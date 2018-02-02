function enterAnythingElseAndContinue(anythingElse) {

    const I = this;

    I.fillField('#otherReasonForAppealing', anythingElse);
    I.click('Continue');
}

function enterReasonForAppealAndContinue(reason, link) {

    const I = this;

    I.click(link);
    I.fillField('input[name="item.whatYouDisagreeWith"]', reason.what);
    I.fillField('textarea[name="item.reasonForAppealing"]', reason.why);
    I.click('Continue');

}

module.exports = {
    enterReasonForAppealAndContinue,
    enterAnythingElseAndContinue
};
