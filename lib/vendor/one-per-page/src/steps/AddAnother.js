const Question = require('./Question');
const { defined } = require('../util/checks');
const { flattenObject } = require('../util/ops');
const { filledForm } = require('../forms/filledForm');
const { form, list, appendToList } = require('../forms');
const { METHOD_NOT_ALLOWED, OK, UNPROCESSABLE_ENTITY } = require('http-status-codes');
const { expectImplemented } = require('../errors/expectImplemented');

class AddAnother extends Question {
  constructor(...args) {
    super(...args);
    expectImplemented(this, 'field');
  }
  get form() {
    if (this.isEditMode) {
      return form({ item: appendToList('items', this.index, this.field) });
    }
    return form({ items: this.validateList(list(this.field)) });
  }

  validateList(items) {
    return items;
  }

  deleteUrl(index) {
    return `${this.path}/item-${index}/delete`;
  }

  editUrl(index) {
    return `${this.path}/item-${index}`;
  }

  get addAnotherUrl() {
    if (this.isListMode) {
      return this.editUrl(this.fields.items.value.length);
    }
    return this.path;
  }

  get mode() {
    if (defined(this.req.params) && defined(this.req.params['0'])) {
      if (defined(this.req.params['1'])) {
        return 'delete';
      }
      return 'edit';
    }
    return 'list';
  }
  get isListMode() {
    return this.mode === 'list';
  }
  get isEditMode() {
    return this.mode === 'edit';
  }
  get isDeleteMode() {
    return this.mode === 'delete';
  }

  get postUrl() {
    if (this.isEditMode) {
      return this.editUrl(this.index);
    }
    return super.postUrl;
  }

  get index() {
    if (defined(this.req.params) && defined(this.req.params['0'])) {
      return parseInt(this.req.params['0']);
    }
    return -1;
  }

  handler(req, res) {
    if (this.isListMode) {
      this.listModeHandler(req, res);
    } else if (this.isEditMode) {
      this.editModeHandler(req, res);
    } else if (this.isDeleteMode) {
      this.deleteModeHandler(req, res);
    } else {
      throw new Error(`mode: ${this.mode} not recognised`);
    }
  }

  listModeHandler(req, res) {
    if (req.method === 'GET') {
      this.renderPage();
    } else if (req.method === 'POST') {
      this.retrieve();
      this.validate();

      if (this.valid) {
        this.next().redirect(req, res);
      } else {
        res.render(this.template, this.locals);
      }
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }

  editModeHandler(req, res) {
    if (req.method === 'GET') {
      this.renderPage();
    } else if (req.method === 'POST') {
      this.parse();
      this.validate();
      if (this.valid) {
        this.store();
        if (this.xhr) {
          res.status(OK).json({ validationErrors: [] });
        } else {
          res.redirect(this.path);
        }
      } else {
        if (this.xhr) {
          res.status(UNPROCESSABLE_ENTITY).json(this.buildValidationErrors);
        } else {
          res.render(this.template, this.locals);
        }
      }
    } else {
      res.redirect(this.path);
    }
  }

  deleteModeHandler(req, res) {
    if (req.method === 'GET') {
      this.retrieve();
      const fieldsAsArray = Object.values(this.fields.items.fields);

      if (fieldsAsArray.length > this.index) {
        fieldsAsArray.splice(this.index, 1);
        const newFields = fieldsAsArray
          .map((field, i) => {
            return { [i]: field };
          })
          .reduce(flattenObject, {});
        const items = this.fields.items.clone({ fields: newFields });

        this.fields = filledForm({ items });
        this.store();
      }
    }
    res.redirect(this.path);
  }

  get buildValidationErrors() {
    let validationErrors = [];

    if (this.fields.item) {
      if (this.fields.item.fields) {
        const fields = this.fields.item.fields;
        const fieldList = Object.keys(fields);
        validationErrors = fieldList.map(field => {
          return {
            field,
            errors: fields[field].errors,
            value: fields[field].value
          };
        });
      } else {
        validationErrors = {
          field: this.fields.item.name,
          errors: this.fields.item.errors,
          value: this.fields.item.value
        };
      }
    }
    return { validationErrors };
  }

  static get pathToBind() {
    // return `${super.path}/foo(\\d)/`;
    return `${super.path}(?:/item-(\\d{1,})/?(?:(delete)/?)?)?`;
  }
}

module.exports = AddAnother;
