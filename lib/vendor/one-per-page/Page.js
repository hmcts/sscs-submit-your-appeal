class Page {
  constructor(options = {}) {
    this.journey = options.journey;
    this.req = options.req;
    this.res = options.res;
    this.fields = {};
    this.template = options.template || '';
    this.locals = options.locals || {};
  }

  static get path() {
    return '/';
  }

  get middleware() {
    return [];
  }

  handler(req, res, next) {
    if (next) return next();
    if (res && res.send) return res.send('OK');
    return null;
  }

  store() {
    // intended to be overridden by subclasses
  }

  retrieve() {
    // intended to be overridden by subclasses
  }

  parse() {
    // intended to be overridden by subclasses
  }

  validate() {
    return { valid: true };
  }
}

module.exports = Page;
