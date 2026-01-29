const { notDefined, defined, ensureArray } = require('../util/checks');
const deepmerge = require('deepmerge');
const log = require('../util/logging')('RequestBoundJourney');
const loadStepContent = require('../i18n/loadStepContent');
const { i18NextInstance } = require('../i18n/i18Next');

const getName = stepOrName => {
  if (typeof stepOrName === 'string') {
    return stepOrName;
  }
  if (defined(stepOrName.name)) {
    return stepOrName.name;
  }
  throw new Error(`${stepOrName} is not a step`);
};

const hasValues = step => 'values' in step;
const hasAnswers = step => 'answers' in step;

class StepsNotCollected extends Error {
  constructor(stepname) {
    super();
    this.message = [
      'Visited steps have not been collected.',
      `Add this.journey.collectSteps to ${stepname}.middleware`
    ].join('');
  }
}

class RequestBoundJourney {
  constructor(req, res, steps, settings) {
    this.req = req;
    req.journey = this;
    this.res = res;
    this.steps = steps;
    this.settings = settings;
    this.instances = {};

    this.collectSteps = this.collectSteps.bind(this);
  }

  instance(Step) {
    const name = getName(Step);
    if (defined(this.instances[name])) {
      log.debug(`Reusing instance of ${name}`);
      return this.instances[name];
    }
    if (defined(this.steps[name])) {
      log.debug(`Creating instance of ${name}`);
      this.instances[name] = new this.steps[name](this.req, this.res);
      return this.instances[name];
    }
    throw new Error(`${name} not registered`);
  }

  collectSteps(req, res, next) {
    this.visitedSteps = this.walkTree();

    Promise.all(this.visitedSteps.map(step =>
      loadStepContent.loadStepContent(step, i18NextInstance)
    ))
      .then(() => next())
      .catch(next);
  }

  completeUpTo(step) {
    if (!defined(this.visitedSteps)) {
      throw new Error('Must collectSteps before using journey.completeUpTo');
    }
    return defined(this.visitedSteps.find(v => v.name === step.name));
  }

  continueUrl() {
    if (!defined(this.visitedSteps)) {
      throw new Error('Must collectSteps before using journey.continueUrl');
    }
    if (this.visitedSteps.length > 0) {
      return this.visitedSteps[this.visitedSteps.length - 1].path;
    }
    return this.steps[this.entryPoint].path;
  }

  get entryPoint() {
    if (defined(this.req.session.entryPoint)) {
      return this.req.session.entryPoint;
    }
    throw new Error('No entryPoint defined in session');
  }

  walkTree(from = this.entryPoint) {
    return this.instance(from).flowControl.walk();
  }

  get values() {
    if (notDefined(this.visitedSteps)) {
      throw new StepsNotCollected(this.req.currentStep.name);
    }
    return this.visitedSteps
      .filter(hasValues)
      .map(step => step.values())
      .reduce(deepmerge, {});
  }

  get answers() {
    if (notDefined(this.visitedSteps)) {
      throw new StepsNotCollected(this.req.currentStep.name);
    }
    return this.visitedSteps
      .filter(hasAnswers)
      .map(step => step.answers())
      .map(ensureArray)
      .reduce((left, right) => [...left, ...right], []);
  }
}

module.exports = RequestBoundJourney;
