const Redirector = require('./redirector');
const SmartRedirector = require('./smartRedirector');
const Branch = require('./branch');
const Stop = require('./stop');
const journey = require('./journey');
const RequestBoundJourney = require('./RequestBoundJourney');
const Action = require('./action');
const {
  ifCompleteThenContinue,
  continueToNext,
  stopHere,
  validateThenStopHere,
  stopHereIfNextIsInvalid
} = require('./treeWalker');

const goTo = step => new SmartRedirector(step);
const redirectTo = step => new Redirector(step);
const branch = (...redirectors) => new Branch(...redirectors);
const stop = step => new Stop(step);
const action = redirector => new Action(redirector);

module.exports = {
  goTo,
  redirectTo,
  branch,
  stop,
  action,
  journey,
  RequestBoundJourney,
  ifCompleteThenContinue,
  continueToNext,
  stopHere,
  validateThenStopHere,
  stopHereIfNextIsInvalid
};
