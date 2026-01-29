const option = require('option');
const { FieldValue } = require('./fieldValue');
const Joi = require('joi');
const { validator, parseErrorTarget } = require('./validator');
const { defined } = require('../util/checks');


const getValue = (name, body) => option
  .fromNullable(body[name])
  .valueOrElse(undefined); // eslint-disable-line no-undefined


const omitIfUndefined = field => {
  if (defined(field.value)) {
    return { [field.name]: field.value };
  }
  return {};
};


class FieldDescriptor {
  constructor({
    parser = getValue,
    deserializer = getValue,
    filledCheck = defined,
    serializer = omitIfUndefined,
    validations = []
  } = {}) {
    this.parser = parser;
    this.deserializer = deserializer;
    this.serializer = serializer;
    this.validations = validations;
    this.filledCheck = filledCheck;
  }

  clone(overrides) {
    return new this.constructor(Object.assign({}, this, overrides));
  }

  ensureField(name, value) {
    if (value instanceof FieldValue) return value;
    return FieldValue.from({ name, value }, this);
  }

  parse(name, body = {}, req = {}) {
    return this.ensureField(name, this.parser(name, body, req));
  }

  deserialize(name, values = {}, req = {}) {
    return this.ensureField(name, this.deserializer(name, values, req));
  }

  checkField(targetOrError, check) {
    const { message, id } = parseErrorTarget(targetOrError);
    const validations = [...this.validations, validator(id, message, check)];
    return this.clone({ validations });
  }

  joi(targetOrError, joiSchema) {
    const joi = field => {
      const { error } = Joi.validate(field.value, joiSchema);
      return !error;
    };
    return this.checkField(targetOrError, joi);
  }

  check(targetOrError, test) {
    return this.checkField(targetOrError, field => test(field.value));
  }
}

const fieldDescriptor = (...args) => new FieldDescriptor(...args);

module.exports = { FieldDescriptor, fieldDescriptor };
