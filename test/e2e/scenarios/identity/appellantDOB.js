const appellantDOB = require('steps/identity/appellant-dob/content.en').fields;
const paths = require('paths');

Feature('Appellant DOB form');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.identity.enterAppellantDOB);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I fill in the fields and click Continue, I am taken to the Appellant NINO page', (I) => {

    I.fillField('AppellantDOB_day', '21');
    I.fillField('AppellantDOB_month', '03');
    I.fillField('AppellantDOB_year', '1981');
    I.click('Continue');
    I.seeCurrentUrlEquals(paths.identity.enterAppellantNINO);

});

Scenario('When I click Continue without filling in the fields I see errors', (I) => {

    I.click('Continue');
    I.see(appellantDOB.day.error.required);
    I.see(appellantDOB.month.error.required);
    I.see(appellantDOB.year.error.required);

});
