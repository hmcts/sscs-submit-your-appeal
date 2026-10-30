class FieldError {
  constructor(field, errorMessage) {
    this.field = field;
    this.message = errorMessage;
  }

  get id() {
    return this.field.id;
  }
}

module.exports = FieldError;
