const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { regex, email } = require('utils/Validators');
const { postCode, niNumber, firstName, lastName, whitelist, phoneNumber } = require('utils/regex');
const content = require('./content');

const allowEmpty = true;

class AppellantDetails extends Question {

    get url() {
        return '/enter-appellant-details';
    }

    get template() {
        return `identity/appellant-details/template`;
    }

    get i18NextContent() {
        return content;
    }

    get form() {

        const fields = this.content.fields;

        return form(

            field('firstName')
                .validate(regex(firstName, fields.firstName))
                .content(fields.firstName),

            field('lastName')
                .validate(regex(lastName, fields.lastName))
                .content(fields.lastName),

            field('niNumber')
                .validate(regex(niNumber, fields.niNumber))
                .content(fields.niNumber),

            field('addressLine1')
                .validate(regex(whitelist, fields.addressLine1))
                .content(fields.addressLine1),

            field('addressLine2')
                .validate(regex(whitelist, fields.addressLine2))
                .content(fields.addressLine2),

            field('townCity')
                .validate(regex(whitelist, fields.townCity))
                .content(fields.townCity),

            field('postCode')
                .validate(regex(postCode, fields.postCode))
                .content(fields.postCode),

            field('phoneNumber')
                .validate(regex(phoneNumber, fields.phoneNumber, allowEmpty))
                .content(fields.phoneNumber),

            field('emailAddress')
                .validate(email(fields.emailAddress, allowEmpty))
                .content(fields.emailAddress),
        );
    }

    next() {
        return goTo(this.journey.AppellantSMSNotify);
    }
}

module.exports = AppellantDetails;
