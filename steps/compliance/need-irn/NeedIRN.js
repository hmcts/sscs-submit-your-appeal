const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');
const { isIba } = require('utils/benefitTypeUtils');

class NeedIRN extends ExitPoint {
  static get path() {
    return paths.compliance.needIRN;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && !isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }
}

module.exports = NeedIRN;
