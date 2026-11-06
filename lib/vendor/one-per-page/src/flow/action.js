const { notDefined } = require('../util/checks');
const log = require('../util/logging')('action');

class Action {
  constructor(action, nextFlow, errorFlow) {
    this.action = action;
    this.nextFlow = nextFlow;
    this.errorFlow = errorFlow;
  }

  redirect(req, res, next) {
    const promise = this.performAction(req, res);

    return promise
      .then(() => {
        if (notDefined(this.nextFlow)) {
          const errorMessage = `No flow chained to action from ${req.path}`;
          log.error(errorMessage);
          next(errorMessage);
          return;
        }
        if (typeof this.nextFlow === 'function') {
          this.nextFlow(req, res, next);
        } else {
          this.nextFlow.redirect(req, res, next);
        }
      })
      .catch(error => {
        if (notDefined(this.errorFlow)) {
          const errorMsg = `No error flow chained to action from ${req.path}`;
          log.warn(errorMsg);
          next(error);
          return;
        }
        log.error(error);

        if (typeof this.errorFlow === 'function') {
          this.errorFlow(error, req, res, next);
        } else {
          this.errorFlow.redirect(req, res, next);
        }
      });
  }

  performAction(req, res) {
    try {
      return Promise.resolve(this.action(req, res));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  then(nextFlow) {
    this.nextFlow = nextFlow;
    return this;
  }

  onFailure(errorFlow) {
    this.errorFlow = errorFlow;
    return this;
  }

  get step() {
    return this.nextFlow.step;
  }
}

module.exports = Action;
