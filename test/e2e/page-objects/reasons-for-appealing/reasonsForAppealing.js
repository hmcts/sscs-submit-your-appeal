function enterReasonForAppealingAndContinue(reason) {

    const I = this;

    I.fillField('#reasonForAppealing', reason);
    I.click('Continue');
}

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

function seeReasonForAppealInList(reason) {

    const I = this;

    I.see(reason.what);
    I.see(reason.why);

}

function dontSeeReasonForAppealInList(reason) {

    const I = this;

    I.dontSee(reason.what);
    I.dontSee(reason.why);

}

module.exports = {
    enterReasonForAppealAndContinue,
    seeReasonForAppealInList,
    dontSeeReasonForAppealInList,
    enterReasonForAppealingAndContinue,
    enterAnythingElseAndContinue
};
