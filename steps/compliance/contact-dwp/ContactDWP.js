const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');
const config = require('config');

const allowUC = config.get('features.allowUC.enabled') === 'true';

class ContactDWP extends ExitPoint {
  static get path() {
    return paths.compliance.contactDWP;
  }

  get allowUC() {
    return allowUC;
  }
}

module.exports = ContactDWP;
