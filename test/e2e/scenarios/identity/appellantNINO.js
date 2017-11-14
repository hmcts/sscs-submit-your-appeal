const assert = require('assert');
const paths = require('paths');

Feature('Appellant NINO form');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.identity.enterAppellantNINO);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I go to the Enter Appellant NINO page I see the correct title and subtitle displayed', function*(I) {
    const expected = 'Enter your National Insurance number';
    I.see(expected);
    const actual = yield I.grabTextFrom('.heading-large');
    const result = actual.search(/Enter your|appellants National Insurance Number/g);
    assert.notEqual(result, -1, `actual: ${actual} \n expected: ${expected} \n Does Not Match` );
    I.see('You can find your National Insurance number on any letter about the benefit.');
});
