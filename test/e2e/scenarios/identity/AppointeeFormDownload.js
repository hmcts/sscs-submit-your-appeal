const content = require('steps/identity/appointee-form-download/content.en.json');
const paths = require('paths');

Feature('Form download page');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.identity.downloadAppointeeForm);
});

After((I) => {
    I.endTheSession();
});

Scenario('I see the correct information is displayed', (I) => {

    I.see(content.title);
    I.see("Download and fill out a SSCS1 form to appeal a benefit decision.");
    I.see(content.button.text);

});
