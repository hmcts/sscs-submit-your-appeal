'use strict';

const { form, textField } = require('@hmcts/one-per-page/forms');
const { Question, goTo} = require('@hmcts/one-per-page');
const paths = require('paths');
const answer = require('utils/answer');

class AppellantNINO extends Question {

	get url() {
		return paths.identity.enterAppellantNINO;
	}

	get isAppointee() {
		return this.fields.appointee.value === answer.YES;
	}

	get form() {
		return form(
			textField.ref(this.journey.Appointee, 'appointee')
		);
	}

	next() {
		return goTo(undefined);
	}
}

module.exports = AppellantNINO;
