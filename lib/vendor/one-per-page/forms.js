// More capable minimal forms shim for vendored @hmcts/one-per-page
// This shim aims to be permissive: field definitions support .joi chaining
// and produced field instances have .value and .validate() used by code.

class Field {
  constructor(def = {}) {
    this._def = def;
    this.value = def.value || '';
  }

  validate() {
    // permissive: consider required if def._required is set
    if (this._def && this._def._required) {
      return this.value !== '';
    }
    return true;
  }
}

function form(schema = {}) {
  // schema: { fieldName: fieldDefinition }
  const meta = { schema };

  meta.retrieve = (step, req) => {
    // Build simple field objects for each schema key
    const fields = {};
    Object.keys(schema).forEach(k => {
      const def = schema[k] || {};
      const f = new Field(def);
      // if there's a session value for the page, attempt to use it
      try {
        const pageName = (step && step.name) || (req && req.path) || null;
        if (req && req.session && pageName && req.session[pageName]) {
          // try to find a value at req.session[pageName][k]
          const v = req.session[pageName][k];
          if (typeof v !== 'undefined') f.value = v;
        }
      } catch (_) {}
      fields[k] = f;
    });

    return fields;
  };

  return meta;
}

const text = {
  joi(msg, schema) {
    const def = { _msg: msg, _schema: schema, _required: false };
    const obj = {
      _def: def,
      joi: (m, s) => {
        // set required if Joi schema is passed
        obj._def._required = true;
        obj._def._msg = m || obj._def._msg;
        obj._def._schema = s || obj._def._schema;
        return obj;
      },
      retrieve: () => ({ value: '' }),
      value: ''
    };
    return obj;
  }
};

function object(shape) {
  return { shape };
}

function ref(step, type, field) {
  return { step, type, field };
}

module.exports = {
  form,
  text,
  object,
  ref
};
