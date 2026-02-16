const Page = require('./Page');
const requireSession = require('./../session/requireSession');
const { stopHereIfNextIsInvalid } = require('../flow/treeWalker');

class Interstitial extends Page {
  get middleware() {
    return [...super.middleware, requireSession];
  }

  handler(req, res, next) {
    if (req.method === 'POST') {
      this.next().redirect(req, res, next);
    } else {
      super.handler(req, res, next);
    }
  }

  get postUrl() {
    return this.path;
  }

  get flowControl() {
    return stopHereIfNextIsInvalid(this);
  }
}

module.exports = Interstitial;
