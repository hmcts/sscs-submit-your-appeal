function selectAreYouAnAppointeeAndContinue(option) {

    const I = this;

    I.amOnPage('/are-you-an-appointee');
    I.checkOption(option);
    I.click('Continue');
}

module.exports = { selectAreYouAnAppointeeAndContinue };