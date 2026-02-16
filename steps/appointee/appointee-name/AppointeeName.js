const { goTo } = require('lib/vendor/one-per-page');
const { form, text } = require('lib/vendor/one-per-page/forms');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { firstName, lastName } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const titlesList = require('utils/titlesList');
const { decode } = require('utils/stringUtils');
const { isIba } = require('utils/benefitTypeUtils');

class AppointeeName extends SaveToDraftStore {
  static get path() {
    return paths.appointee.enterAppointeeName;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  get titlesList() {
    return titlesList;
  }

  get form() {
    const fields = this.content.fields;
    const validTitles = titlesList.map(title => title.value);
    return form({
      // Spread the titles array so .valid receives variadic args (Joi v18+)
      title: text
        .joi(fields.title.error.required, Joi.string().required())
        .joi(fields.title.error.invalid, Joi.string().valid(...validTitles)),
      firstName: text
        .joi(fields.firstName.error.required, Joi.string().required())
        .joi(
          fields.firstName.error.invalid,
          Joi.string().trim().regex(firstName)
        ),
      lastName: text
        .joi(fields.lastName.error.required, Joi.string().required())
        .joi(fields.lastName.error.invalid, Joi.string().trim().regex(lastName))
    });
  }

  answers() {
    const title = this.fields.title.value;
    const first = this.fields.firstName.value;
    const last = this.fields.lastName.value;
    return [
      answer(this, {
        question: this.content.cya.appointeeName.question,
        section: sections.appointeeDetails,
        answer: decode(`${title} ${first} ${last}`)
      })
    ];
  }

  values() {
    const title = this.fields.title.value;
    const first = this.fields.firstName.value;
    const last = this.fields.lastName.value;
    return {
      appointee: {
        title: decode(title),
        firstName: decode(first),
        lastName: decode(last)
      }
    };
  }

  next() {
    return goTo(this.journey.steps.AppointeeDOB);
  }
}

module.exports = AppointeeName;
