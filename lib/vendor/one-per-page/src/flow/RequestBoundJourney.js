const { notDefined, defined, ensureArray } = require('../util/checks');
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

/**
 * Implement a small, safe recursive merge to avoid third-party deepmerge issues
 * that attempt to set properties on primitives. This prefers object recursion
 * and overwrites primitives/arrays with the later value.
 */
function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function safeMerge(target, source) {
  // mutate and return target
  Object.keys(source).forEach(key => {
    const srcVal = source[key];
    const tgtVal = target[key];
    if (isPlainObject(srcVal) && isPlainObject(tgtVal)) {
      safeMerge(tgtVal, srcVal);
    } else if (Array.isArray(srcVal) && Array.isArray(tgtVal)) {
      // concatenate arrays (same behaviour as many merges)
      target[key] = tgtVal.concat(srcVal);
    } else {
      // overwrite with source value for primitives, arrays, or when target isn't an object
      target[key] = srcVal;
    }
  });
  return target;
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
    // Prevent recursive re-entry: some step getters may call `this.req.journey.values`
    // which would recursively invoke this getter while it is still computing.
    // In that case, return an empty object to avoid merging primitives and
    // to break the cycle. Cache the computed values for this request to avoid
    // recomputation.
    if (this._valuesComputing) {
      return {};
    }
    if (this._valuesCache) {
      return this._valuesCache;
    }
    this._valuesComputing = true;
    try {
      const valuesArray = this.visitedSteps
        .filter(hasValues)
        .map(step => {
          try {
            const values = step.values();
            if (values && typeof values === 'object') return values;

            log.warn(`RequestBoundJourney: steps returned non-object values(): ${JSON.stringify(values)}`);
          } catch (error) {
            log.debug(`Ignoring values() from step ${step.name} due to error: ${error.message}`);
          }
          return {};
        });

      // Filter to plain objects only (exclude arrays and primitives) before merging.
      const plainObjectValues = valuesArray.filter(v => v && typeof v === 'object' && !Array.isArray(v));
      let merged = {};
      try {
        if (plainObjectValues.length === 0) {
          merged = {};
        } else {
          // Use our safeMerge implementation to merge plain objects.
          merged = plainObjectValues.reduce((acc, v) => {
            try {
              return safeMerge(acc, v);
            } catch (error) {
              log.debug(`RequestBoundJourney: safeMerge failed for one value: ${error && error.message}`);
              return acc;
            }
          }, {});
        }
      } catch (mergeError) {
        // Log detailed diagnostics to aid debugging then fall back to empty object.
        try {
          log.error(`RequestBoundJourney: merge failed: ${mergeError && mergeError.message}`);
          log.debug(`RequestBoundJourney: plainObjectValues types: ${plainObjectValues.map(v => typeof v).join(',')}`);
          log.debug('RequestBoundJourney: merge error details available in logger');
        } catch (error) {
          // ignore logging errors
        }
        merged = {};
      }
      this._valuesCache = merged;
      return merged;
    } finally {
      this._valuesComputing = false;
    }
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
