const { goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { get } = require('lodash');
const { firstName, lastName } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const titlesList = require('../../../utils/titlesList');
const { decode } = require('utils/stringUtils');

class AppellantName extends SaveToDraftStore {
  static get path() {
    return paths.identity.enterAppellantName;
  }

  isAppointee() {
    return get(this, 'journey.req.session.Appointee.isAppointee') === 'yes';
  }

  contentPrefix() {
    return this.isAppointee() ? 'withAppointee' : 'withoutAppointee';
  }
  get title() {
    return this.content.title[this.contentPrefix()];
  }

  get subtitle() {
    return this.content.subtitle[this.contentPrefix()];
  }

  get titlesList() {
    return titlesList;
  }

  get form() {
    const fields = this.content.fields;
    const prefix = this.contentPrefix();
    const validTitles = titlesList.map(title => title.value);

    return form({
      title: text.joi(
        fields.title.error[prefix].required,
        Joi.string().required()
      ).joi(
        fields.title.error[prefix].invalid,
        Joi.string().valid(validTitles)
      ),
      firstName: text.joi(
        fields.firstName.error[prefix].required,
        Joi.string().required()
      ).joi(
        fields.firstName.error[prefix].invalid,
        Joi.string().trim().regex(firstName)
      ),
      lastName: text.joi(
        fields.lastName.error[prefix].required,
        Joi.string().required()
      ).joi(
        fields.lastName.error[prefix].invalid,
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
        answer: decode(`${title} ${first} ${last}`)
      })
    ];
  }

  values() {
    if (!this.valid) return {};

    return {
      appellant: {
        title: decode(this.fields.title.value),
        firstName: decode(this.fields.firstName.value),
        lastName: decode(this.fields.lastName.value)
      }
    };
  }

  next() {
    return goTo(this.journey.steps.AppellantDOB);
  }
}

module.exports = AppellantName;
