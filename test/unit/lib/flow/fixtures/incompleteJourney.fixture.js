const EntryPoint = require('lib/vendor/one-per-page/src/steps/EntryPoint');
const Question = require('lib/vendor/one-per-page/src/steps/Question');
const { text, form } = require('lib/vendor/one-per-page/src/forms');
const { goTo, RequestBoundJourney } = require('lib/vendor/one-per-page/src/flow');
const CheckYourAnswers = require('lib/vendor/one-per-page/src/steps/check-your-answers/CheckYourAnswers');
const Joi = require('joi');

class Entry extends EntryPoint {
  next() {
    return goTo(this.journey.steps.Name);
  }
}
class Name extends Question {
  get form() {
    return form({ notPresent: text.joi('required', Joi.string().required()) });
  }
  next() {
    return goTo(this.journey.steps.CheckAnswers);
  }
}
class CheckAnswers extends CheckYourAnswers {}
const steps = { Entry, Name, CheckAnswers };
const session = {
  entryPoint: Entry.name,
  Name: {}
};
const req = { session };
const res = {};

const journey = new RequestBoundJourney(req, res, steps, {});

module.exports = { journey, Entry, Name };
