const BaseStep = require('./BaseStep');
const { expectImplemented } = require('../errors/expectImplemented');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const { continueToNext } = require('../flow');

class Redirect extends BaseStep {
  constructor(...args) {
    super(...args);
    expectImplemented(this, 'next');
  }

  handler(req, res, next) {
    if (req.method === 'GET') {
      this.next().redirect(req, res, next);
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }

  get flowControl() {
    return continueToNext(this);
  }
}

module.exports = Redirect;
