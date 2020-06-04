const { goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { firstName, lastName } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const titlesList = require('../../../utils/titlesList');
const { decode } = require('utils/stringUtils');
const parseFullName = require('parse-full-name').parseFullName;
const checkWelshToggle = require('middleware/checkWelshToggle');

class AppointeeName extends SaveToDraftStore {
  static get path() {
    return paths.appointee.enterAppointeeName;
  }

  get titlesList() {
    return titlesList;
  }

  get form() {
    const fields = this.content.fields;
    const validTitles = titlesList.map(title => title.value);
    return form({
      title: text.joi(
        fields.title.error.required,
        Joi.string().required()
      ).joi(
        fields.title.error.invalid,
        Joi.string().valid(validTitles)
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

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }

  answers() {
    const title = this.fields.title.value;
    const first = this.fields.firstName.value;
    const last = this.fields.lastName.value;
    const fullName = parseFullName(`${first} ${last}`, 'all', 1, 0, 0);
    return [
      answer(this, {
        question: this.content.cya.appointeeName.question,
        section: sections.appointeeDetails,
        answer: decode(`${title} ${fullName.first} ${fullName.last}`)
      })
    ];
  }

  values() {
    const title = this.fields.title.value;
    const first = this.fields.firstName.value;
    const last = this.fields.lastName.value;
    const fullName = parseFullName(`${first} ${last}`, 'all', 1, 0, 0);
    return {
      appointee: {
        title: decode(title),
        firstName: decode(fullName.first),
        lastName: decode(fullName.last)
      }
    };
  }

  next() {
    return goTo(this.journey.steps.AppointeeDOB);
  }
}

module.exports = AppointeeName;
