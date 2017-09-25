function selectAreYouAnAppointeeAndContinue(option) {

    const I = this;

    I.amOnPage('/appointee');
    I.checkOption(option);
    I.click('Continue');
}

module.exports = { selectAreYouAnAppointeeAndContinue };