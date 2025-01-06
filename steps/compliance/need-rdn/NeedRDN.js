const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');
const { isIba } = require('utils/benefitTypeUtils');

class NeedRDN extends ExitPoint {
  static get path() {
    return paths.compliance.needRDN;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && !isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }
}

module.exports = NeedRDN;
