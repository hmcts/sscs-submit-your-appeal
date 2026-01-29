const { notDefined } = require('../util/checks');
const {
  andWise, orWise,
  flattenArray, flattenObject
} = require('../util/ops');
const option = require('option');
const { cloneDeep } = require('lodash');
const watches = require('../util/watches');

const fieldsProp = Symbol('fields');
const filled = Symbol('filledFromTemp');

class FilledForm {
  constructor(fieldValues = {}, filledFromTemp = false) {
    this[fieldsProp] = fieldValues;
    this[filled] = filledFromTemp;

    Object.entries(this.fields).forEach(([key, field]) => {
      this[key] = field;
    });
  }

  get fields() {
    return this[fieldsProp];
  }

  store(stepName, req) {
    if (notDefined(req.session)) {
      throw new Error('Session not initialized');
    }

    const prevSession = cloneDeep(req.session);

    const existingValues = option
      .fromNullable(req.session[stepName])
      .valueOrElse({});

    const values = Object.values(this.fields)
      .map(field => field.serialize(existingValues))
      .reduce(flattenObject, {});

    if (values !== {}) {
      Object.assign(req.session, { [stepName]: values, temp: {} });
    }

    const session = watches.traverseWatches(req.journey, prevSession, req.session);
    Object.assign(req.session, session);
  };

  tempStore(stepName, req) {
    if (notDefined(req.session)) {
      throw new Error('Session not initialized');
    }
    const existingValues = option
      .fromNullable(req.session[stepName])
      .valueOrElse({});

    const values = Object.values(this.fields)
      .map(field => field.serialize(existingValues))
      .reduce(flattenObject, {});

    if (values !== {}) {
      Object.assign(req.session, { temp: { [stepName]: values } });
    }
  }

  validate() {
    return Object.values(this.fields)
      .map(field => field.validate())
      .reduce(andWise, true);
  }

  get validated() {
    return Object.values(this.fields)
      .map(field => field.validated)
      .reduce(orWise, false);
  }

  get errors() {
    return Object.values(this.fields)
      .map(field => field.mappedErrors)
      .reduce(flattenArray, []);
  }

  get valid() {
    return !Object.values(this.fields)
      .some(field => !field.valid);
  }

  get isFilled() {
    return this[filled] || Object.values(this.fields)
      .some(field => field.isFilled);
  }
}

const filledForm = (...args) => new FilledForm(...args);

module.exports = { FilledForm, filledForm };
