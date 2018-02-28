function enterReasonsForBeingLateAndContinue(reason) {

    const I = this;

    I.fillField('#reasonForBeingLate', reason);
    I.click('Continue');
}

module.exports = { enterReasonsForBeingLateAndContinue };
