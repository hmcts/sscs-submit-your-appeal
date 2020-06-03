const { ExitPoint } = require('@hmcts/one-per-page');
const { Interstitial } = require('@hmcts/one-per-page/steps');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { SaveToDraftStoreCYA } = require('middleware/draftAppealStoreMiddleware');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');

class shimSessionExitPoint extends ExitPoint {
  handler(req, res) {
    if (req.method === 'GET') {
      res.render(this.template, this.locals, (error, html) => {
        delete this.req.session.featureToggles;
        this.res.send(html);
      });
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

class shimSessionInterstitial extends Interstitial {
  handler(req, res, next) {
    if (req.method === 'POST') {
      this.next().redirect(req, res, next);
    } else if (req.method === 'GET') {
      const locals = this.locals;
      res.render(this.template, locals, (error, html) => {
        delete this.req.session.featureToggles;
        this.res.send(html);
      });
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

class shimSessionSaveToDraftStore extends SaveToDraftStore {
  renderPage() {
    this.retrieve();
    if (this.fields.isFilled) {
      this.validate();
    }
    if (this.xhr) {
      this.res.send(this.fields);
    } else {
      this.res.render(this.template, this.locals, (error, html) => {
        delete this.req.session.featureToggles;
        this.res.send(html);
      });
    }
  }
}

class shimSessionSaveToDraftStoreCYA extends SaveToDraftStoreCYA {
  renderPage() {
    this.retrieve();
    if (this.fields.isFilled) {
      this.validate();
    }
    if (this.xhr) {
      this.res.send(this.fields);
    } else {
      this.res.render(this.template, this.locals, (error, html) => {
        delete this.req.session.featureToggles;
        this.res.send(html);
      });
    }
  }
}

module.exports = {
  shimSessionExitPoint,
  shimSessionInterstitial,
  shimSessionSaveToDraftStore,
  shimSessionSaveToDraftStoreCYA
};
