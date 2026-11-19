const Page = require('./Page');
const destroySession = require('../session/destroySession');
const { stopHere } = require('../flow');

class ExitPoint extends Page {
  get middleware() {
    return [...super.middleware, destroySession];
  }

  get flowControl() {
    return stopHere(this);
  }
}

module.exports = ExitPoint;
