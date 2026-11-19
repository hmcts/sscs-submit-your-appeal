const EntryPoint = require('lib/vendor/one-per-page/src/steps/EntryPoint');
const Question = require('lib/vendor/one-per-page/src/steps/Question');
const { goTo, RequestBoundJourney } = require('lib/vendor/one-per-page/src/flow');
const CheckYourAnswers = require('lib/vendor/one-per-page/src/steps/check-your-answers/CheckYourAnswers');

class Entry extends EntryPoint {
  next() {
    return goTo(this.journey.steps.A);
  }
}
class A extends Question {
  next() {
    return goTo(this.journey.steps.B);
  }
}
class B extends Question {
  next() {
    return goTo(this.journey.steps.C);
  }
}
class C extends Question {
  next() {
    return goTo(this.journey.steps.A);
  }
}
class CheckAnswers extends CheckYourAnswers {}
const steps = { Entry, A, B, C, CheckAnswers };
const req = { session: { entryPoint: Entry.name } };
const res = {};

const journey = new RequestBoundJourney(req, res, steps, {});

module.exports = journey;
