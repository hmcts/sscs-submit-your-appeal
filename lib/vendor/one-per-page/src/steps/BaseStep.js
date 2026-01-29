const { Router: expressRouter } = require('express');
const { expectImplemented } = require('../errors/expectImplemented');
const callsites = require('callsites');
const path = require('path');
const slug = require('slug');
const { defined, notDefined } = require('../util/checks');
const log = require('../util/logging');
const { timeout } = require('../util/promises');
const errorIfNotReady = require('../middleware/errorIfNotReady');
const { fromNullable } = require('option');

const DEFAULT_WAIT_MS = 50;

const findChildClassFilePath = step => {
  const callsite = callsites();
  return callsite
    .filter(site => site.getFunctionName() === step.name)
    .map(site => site.getFileName())
    .map(file => path.dirname(file))
    .pop();
};

class BaseStep {
  constructor(req, res) {
    expectImplemented(this, 'handler');
    if (notDefined(this.dirname)) {
      this.dirname = findChildClassFilePath(this);
    }
    this.req = req;
    this.res = res;
    this.journey = req.journey;

    this.promises = [];
  }

  waitFor(promise) {
    this.promises.push(promise);
  }

  get timeoutDelay() {
    return fromNullable(this.journey.settings)
      .flatMap(settings => fromNullable(settings.timeoutDelay))
      .valueOrElse(DEFAULT_WAIT_MS);
  }

  ready() {
    return timeout(this.timeoutDelay, Promise.all(this.promises))
      .then(() => this);
  }

  static get path() {
    if (defined(this.prototype.url)) {
      log(this.name).warn('Deprecated: define static #path instead of #url');
      return this.prototype.url;
    }
    const pathSlug = slug(
      this.name.replace(/([A-Z])/g, ' $1'),
      { lower: true }
    );
    return `/${pathSlug}`;
  }
  static get pathToBind() {
    return this.path;
  }

  // allow step to access it's path
  get path() {
    return this.constructor.path;
  }
  get pathToBind() {
    return this.constructor.pathToBind;
  }

  get middleware() {
    return [errorIfNotReady(this)];
  }
  get name() {
    return this.constructor.name;
  }
  get router() {
    if (this._router) return this._router;

    this._router = expressRouter();
    this.middleware.forEach(middleware => {
      this._router.all(this.pathToBind, middleware);
    });
    this._router.all(this.pathToBind, this.handler.bind(this));
    return this._router;
  }

  static bind(app) {
    app.all(this.pathToBind, (req, res, next) => {
      log(this.name).time(`${req.method} ${req.path}`, () => {
        const instance = req.journey.instance(this);
        req.currentStep = instance;
        instance.router.handle(req, res, next);
      });
    });
    log('BaseStep').info(`${this.name} registered to ${this.pathToBind}`);
  }
}

module.exports = BaseStep;
