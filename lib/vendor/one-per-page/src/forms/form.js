const { notDefined } = require('../util/checks');
const { mapEntries } = require('../util/ops');
const { filledForm } = require('./filledForm');
const option = require('option');

class Form {
  constructor(fields = {}) {
    this.fields = fields;
  }

  parse(req) {
    const body = req.body || {};
    const fieldValues = mapEntries(
      this.fields,
      (key, field) => field.parse(key, body, req)
    );
    return filledForm(fieldValues);
  }

  retrieve(stepName, req) {
    if (notDefined(req.session)) {
      throw new Error('Session not initialized');
    }
    const tempValues = option
      .fromNullable(req.session.temp)
      .flatMap(temp => option.fromNullable(temp[stepName]));
    const storedValues = option
      .fromNullable(req.session[stepName]);
    const values = tempValues
      .orElse(storedValues)
      .valueOrElse({});

    const fieldValues = mapEntries(
      this.fields,
      (key, field) => field.deserialize(key, values, req)
    );
    return filledForm(fieldValues, tempValues.isSome());
  }
}

const form = (...args) => new Form(...args);

module.exports = { form, Form };
