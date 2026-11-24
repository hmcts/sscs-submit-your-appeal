const EntryPoint = require('lib/vendor/one-per-page/src/steps/EntryPoint');
const Question = require('lib/vendor/one-per-page/src/steps/Question');
const CheckYourAnswers = require('lib/vendor/one-per-page/src/steps/check-your-answers/CheckYourAnswers');
const { goTo, RequestBoundJourney } = require('lib/vendor/one-per-page/src/flow');
const { text, form } = require('lib/vendor/one-per-page/src/forms');

class Entry extends EntryPoint {
  next() {
    return goTo(this.journey.steps.Name);
  }
}
class Name extends Question {
  get form() {
    return form({
      firstName: text,
      lastName: text
    });
  }
  next() {
    return goTo(this.journey.steps.CheckAnswers);
  }
}
class CheckAnswers extends CheckYourAnswers {}
const steps = { Entry, Name, CheckAnswers };
const session = {
  entryPoint: Entry.name,
  Name: { firstName: 'Michael', lastName: 'Allen' },
  CheckAnswers: { statementOfTruth: true }
};
const res = {};
const req = { session };

const journey = () => new RequestBoundJourney(req, res, steps, {});

module.exports = { journey, Entry, Name, CheckAnswers };
