const Redirector = require('./redirector');
const { defined } = require('../util/checks');

class SmartRedirector extends Redirector {
  redirect(req, res) {
    const instance = req.journey.instance(this.nextStep);
    if (!defined(instance.flowControl)) {
      throw new Error(`${instance.name} does not have a flowControl.`);
    }
    const nextStep = instance.flowControl.last();
    res.redirect(nextStep.path);
  }
}

module.exports = SmartRedirector;
