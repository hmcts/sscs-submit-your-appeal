/* eslint-disable no-throw-literal  */
const { Page } = require('@hmcts/one-per-page');

class DuplicateError extends Page {
  static get path() {
    return '/duplicate-case-error';
  }

  handler(req, res) {
    if (req.method === 'GET') {
      res.render(this.template, this.locals, (error, html) => {
        this.res.send(html);
      });
    }
  }
}

module.exports = DuplicateError;
