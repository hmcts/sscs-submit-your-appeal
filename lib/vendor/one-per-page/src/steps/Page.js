const BaseStep = require('./BaseStep');
const addLocals = require('../middleware/addLocals');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const resolveTemplate = require('../middleware/resolveTemplate');
const { i18NextInstance } = require('../i18n/i18Next');
const { contentProxy } = require('../i18n/contentProxy');
const { defined } = require('../util/checks');
const loadStepContent = require('../middleware/loadStepContent');

const notLocals = [
  '_router',
  'journey',
  'constructor',
  'form',
  'next',
  'locals',
  'middleware',
  'handler',
  'req',
  'res'
];

const allProperties = (obj, arr = []) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const props = [
    ...Object.keys(descriptors).map(key => {
      return { key, descriptor: descriptors[key] };
    }),
    ...arr
  ];
  if (obj.name === 'BaseStep') {
    return props;
  }
  return allProperties(Object.getPrototypeOf(obj), props);
};

class Page extends BaseStep {
  constructor(...args) {
    super(...args);
    this.content = new Proxy(i18NextInstance, contentProxy(this));
  }

  get middleware() {
    return [
      loadStepContent(this),
      ...super.middleware,
      resolveTemplate,
      addLocals
    ];
  }

  get locals() {
    return allProperties(this)
      .filter(({ key }) => !(notLocals.includes(key)))
      .reduce((obj, { key, descriptor }) => {
        if (typeof descriptor.value === 'function') {
          obj[key] = descriptor.value.bind(this);
        } else if (defined(descriptor.value)) {
          obj[key] = this[key];
        } else if (defined(descriptor.get)) {
          const step = this;
          Object.assign(obj, {
            get [key]() {
              return descriptor.get.call(step);
            }
          });
        }

        return obj;
      }, {});
  }

  get i18n() {
    return this.req.i18n;
  }

  handler(req, res) {
    if (req.method === 'GET') {
      res.render(this.template, this.locals);
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

module.exports = Page;
