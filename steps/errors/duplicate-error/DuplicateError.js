
const { Page } = require('@hmcts/one-per-page');
const DateUtils = require('utils/DateUtils');
const i18next = require('i18next');

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

  get duplicateErrorMrnDate() {
    const d = this.req.session.MRNDate.mrnDate;
    return DateUtils.createMoment(
      d.day,
      d.month,
      d.year,
      i18next.language
    ).format('DD MMM YYYY');
  }
}

module.exports = DuplicateError;
