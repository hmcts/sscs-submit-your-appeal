const { notDefined, defined } = require('../util/checks');
const FieldError = require('./fieldError');
const { mapEntries, andWise, flattenArray } = require('../util/ops');
const { validator } = require('./validator');

const failOnFirstFailure = (field, validators) => {
  if (!(validators && validators.length)) {
    return { result: true, errors: [] };
  }
  const [currentValidator, ...rest] = validators;
  if (currentValidator.predicate(field)) {
    return failOnFirstFailure(field, rest);
  }
  return { result: false, errors: [currentValidator.message] };
};

const omitIfUndefined = field => {
  if (notDefined(field.value)) {
    return {};
  }
  return { [field.name]: field.value };
};

const errorsProp = Symbol('errors');
const validatedProp = Symbol('validated');
const validProp = Symbol('valid');

class FieldValue {
  constructor({
    id, name, value,
    validations = [],
    filledCheck = defined,
    serializer = omitIfUndefined
  }) {
    this.id = defined(id) ? id : name;
    this.name = name;
    if (defined(value)) this.value = value;
    this.validations = validations;
    this.serializer = serializer;
    this.filledCheck = filledCheck;

    this[validatedProp] = false;
    this[errorsProp] = [];
  }

  static from(args, fieldDesc) {
    return new this(Object.assign({}, args, {
      validations: fieldDesc.validations,
      serializer: fieldDesc.serializer,
      filledCheck: fieldDesc.filledCheck
    }));
  }

  serialize(values) {
    return this.serializer(this, values);
  }

  serializedValues(existingValues) {
    const serialized = this.serialize(existingValues);
    if (serialized === {}) {
      return undefined; // eslint-disable-line no-undefined
    }
    return serialized[this.name];
  }

  validate() {
    const { result, errors } = failOnFirstFailure(this, this.validations);
    this[errorsProp] = errors;
    this[validProp] = result;
    this[validatedProp] = true;

    return result;
  }

  get errors() {
    return this[errorsProp];
  }
  get valid() {
    return this[validProp];
  }
  get validated() {
    return this[validatedProp];
  }
  get mappedErrors() {
    return this.errors.map(error => new FieldError(this, error));
  }
  get isFilled() {
    return this.filledCheck(this.value);
  }
  get canonicalValue() {
    return this.value;
  }

  clone(overrides) {
    return new this.constructor(Object.assign({}, this, overrides));
  }
}


class ObjectFieldValue extends FieldValue {
  constructor({
    id, name, serializer, filledCheck,
    validations = [], fields = []
  }) {
    const myValidations = validations.filter(v => v.target === 'no-target');
    super({ id, name, serializer, filledCheck, validations: myValidations });

    this.fields = mapEntries(fields, (key, field) => {
      const fieldsValidations = validations
        .filter(v => v.target === key)
        .map(v => validator(v.target, v.message, () => v.predicate(this)));
      const mappedValidations = [...fieldsValidations, ...field.validations];

      return field.clone({ validations: mappedValidations });
    });

    Object.keys(this.fields)
      .forEach(key => {
        this[key] = this.fields[key];
      });
  }

  get value() {
    return mapEntries(this.fields, (name, field) => field.value);
  }

  validate() {
    const childrenAreValid = Object.values(this.fields)
      .map(field => field.validate())
      .reduce(andWise, true);

    if (childrenAreValid) {
      return super.validate();
    }
    this[validatedProp] = true;
    this[validProp] = false;
    return false;
  }

  get mappedErrors() {
    return [
      super.mappedErrors,
      ...Object.values(this.fields).map(field => field.mappedErrors)
    ].reduce((left, right) => [...left, ...right], []);
  }

  get isFilled() {
    return Object.values(this.fields).some(field => field.isFilled);
  }
}


class ListFieldValue extends ObjectFieldValue {
  get value() {
    return Object.values(this.fields).map(field => field.value);
  }
}

class TransformFieldValue extends FieldValue {
  constructor({
    transformation, wrapped,
    validations = [], serializer, filledCheck
  }) {
    super({
      name: wrapped.name,
      id: wrapped.id,
      serializer,
      filledCheck: defined(filledCheck) ? filledCheck : wrapped.filledCheck
    });
    this.wrapped = wrapped;
    this.transformation = transformation;
    this.validations = validations;

    if (defined(this.wrapped.fields)) {
      this.fields = this.wrapped.fields;
      Object.entries(this.wrapped.fields)
        .forEach(([key, childField]) => {
          this[key] = childField;
        });
    }
  }

  validate() {
    if (this.wrapped.validate()) {
      return super.validate();
    }
    this[validProp] = false;
    this[validatedProp] = true;
    return false;
  }

  get value() {
    return this.transformation(this.wrapped.value);
  }

  get errors() {
    return [...this.wrapped.errors, ...super.errors];
  }
  get valid() {
    return super.valid && this.wrapped.valid;
  }
  get validated() {
    return super.validated || this.wrapped.validated;
  }
  get isFilled() {
    return this.wrapped.isFilled;
  }
  get mappedErrors() {
    return [
      this.wrapped.mappedErrors,
      super.errors.map(error => new FieldError(this, error))
    ].reduce(flattenArray);
  }
}

const returnNothing = () => {
  return {};
};
const noTransformation = v => v;

class RefValue extends TransformFieldValue {
  static wrap(fieldValue) {
    return new this({
      transformation: noTransformation,
      wrapped: fieldValue,
      serializer: returnNothing
    });
  }

  get isFilled() {
    // Refs shouldn't be considered when asking if the form has any values
    // as these aren't values produced by this step
    return false;
  }
}

const fieldValue = args => new FieldValue(args);

module.exports = {
  FieldValue, fieldValue,
  ObjectFieldValue,
  ListFieldValue,
  TransformFieldValue,
  RefValue
};
