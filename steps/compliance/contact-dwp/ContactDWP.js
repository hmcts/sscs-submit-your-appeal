const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class ContactDWP extends ExitPoint {
  static get path() {
    return paths.compliance.contactDWP;
  }
}

module.exports = ContactDWP;
