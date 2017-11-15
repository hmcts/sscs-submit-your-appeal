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

Scenario('When I go to the Enter Appellant NINO page I see the correct information is displayed', function*(I) {

  const expected = 'Enter your National Insurance number';
	I.see(expected);
	const actual = yield I.grabTextFrom('.heading-large');
	const result = actual.search(/Enter your|appellants National Insurance Number/g);
	assert.notEqual(result, -1, `actual: ${actual} \n expected: ${expected} \n Does Not Match`);
	I.see('You can find your National Insurance number on any letter about the benefit.');
	I.seeElement('#AppellantNINO_nino');

});

Scenario('Given that user has entered their NINO \n' +
	'When it is in the correct format AA123456A \n' +
	'And they click next \n' +
	'Then they should go to the next page', (I) => {

		I.fillField('#AppellantNINO_nino', 'AA123456A');
		I.click('Continue');
		I.seeInCurrentUrl('/enter-appellant-contact');

	});

Scenario('Given that user has entered their NINO \n' +
	'When it is NOT in the correct format AA123456A \n' +
	'And they click next \n' +
	'Then they should see the error message', (I) => {

		I.fillField('#AppellantNINO_nino', 'AA1234');
		I.click('Continue');
		I.seeElement('#error-summary-heading');

	});
