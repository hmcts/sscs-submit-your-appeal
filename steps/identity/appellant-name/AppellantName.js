const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { get } = require('lodash');
const { whitelist, firstName, lastName } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');

class AppellantName extends Question {
  static get path() {
    return paths.identity.enterAppellantName;
  }

  isAppointee() {
    return get(this, 'journey.req.session.Appointee.isAppointee') === 'yes';
  }

  get title() {
    return this.isAppointee() ?
      get(this, 'content.titleWithAppointee') :
      get(this, 'content.title');
  }

  get subtitle() {
    return this.isAppointee() ?
      get(this, 'content.subtitleWithAppointee') :
      get(this, 'content.subtitle');
  }

  get form() {
    const fields = this.content.fields;
    return form({
      title: text.joi(
        fields.title.error.required,
        Joi.string().required()
      ).joi(
        fields.title.error.invalid,
        Joi.string().regex(whitelist)
      ),
      firstName: text.joi(
        fields.firstName.error.required,
        Joi.string().required()
      ).joi(
        fields.firstName.error.invalid,
        Joi.string().trim().regex(firstName)
      ),
      lastName: text.joi(
        fields.lastName.error.required,
        Joi.string().required()
      ).joi(
        fields.lastName.error.invalid,
        Joi.string().trim().regex(lastName)
      )
    });
  }

  answers() {
    const title = this.fields.title.value;
    const first = this.fields.firstName.value;
    const last = this.fields.lastName.value;
    return [
      answer(this, {
        question: this.content.cya.appellantName.question,
        section: sections.appellantDetails,
        answer: `${title} ${first} ${last}`
      })
    ];
  }

  values() {
    return {
      appellant: {
        title: this.fields.title.value,
        firstName: this.fields.firstName.value,
        lastName: this.fields.lastName.value
      }
    };
  }

  next() {
    return goTo(this.journey.steps.AppellantDOB);
  }
}

module.exports = AppellantName;
