const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const content = require('./content');
const urls = require('urls');

class Appointee extends Question {

    get url() {
        return urls.identity.areYouAnAppointee;
    }

    get form() {
        return form(
            field('isappointee').content(this.content.fields.isappointee)
        );
    }

    get template() {
        return `identity/appointee/template`;
    }

    get i18NextContent() {
        return content;
    }

    next() {
        if(this.fields.get('isappointee').value === 'yes') {
            return goTo(this.journey.AppointeeDetails);
        } else {
            return goTo(this.journey.AppellantDetails);
        }
    }
}

module.exports = Appointee;
