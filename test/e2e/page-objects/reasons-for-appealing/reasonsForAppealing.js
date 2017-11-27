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

module.exports = { enterReasonForAppealingAndContinue, enterAnythingElseAndContinue };
