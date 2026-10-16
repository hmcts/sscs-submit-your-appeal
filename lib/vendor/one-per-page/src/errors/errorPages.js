// const { Page } = require('@hmcts/one-per-page');
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const i18next = require('i18next');
const path = require('path');
const { i18NextInstance } = require('../i18n/i18Next');
const { loadFileContents } = require('../i18n/loadStepContent');
const { isArray, defined } = require('../util/checks');
const log = require('../util/logging')('errorPages');

class ErrorPages {
  /** bind 404 and 500's to the app */
  static bind(app, userOpts) {
    loadFileContents(
      path.join(__dirname, 'errorPages.content.en.json'), i18NextInstance)
      .then(i18Next => {
        const opts = userOpts || {};

        // express requires "error handling" functions to accept 4 args
        // and uses that to identify it as an error handler. So we need to
        // declare next even though we don't use it.
        //
        // eslint-disable-next-line no-unused-vars
        app.use((errors, req, res, next) => {
          log.error(req.path, errors);
          const serverError = opts.serverError || {};
          res.status(INTERNAL_SERVER_ERROR).render(
            serverError.template || i18Next.t('serverError.template'),
            {
              title: serverError.title || i18Next.t('serverError.title'),
              message: serverError.message || i18Next.t('serverError.message'),
              error: errors,
              assets: serverError.assets || i18next.t(
                'serverError.assets',
                { path: `${req.app.locals.asset_path}main.css` }
              )
            }
          );
        });

        app.use((req, res) => {
          const notFound = opts.notFound || {};
          if (defined(notFound.nextSteps) && !isArray(notFound.nextSteps)) {
            throw new TypeError('nextSteps is expected to be an array');
          }
          log.info(req.path, 'No handler found, rendering 404');
          res.status(NOT_FOUND).render(
            notFound.template || i18Next.t('notFound.template'),
            {
              title: notFound.title || i18Next.t('notFound.title'),
              message: notFound.message || i18Next.t('notFound.message'),
              nextSteps: notFound.nextSteps || i18Next.t(
                'notFound.nextSteps', { returnObjects: true }
              ),
              assets: notFound.assets || i18next.t(
                'notFound.assets',
                { path: `${req.app.locals.asset_path}main.css` }
              )
            }
          );
        });
      });
  }
}

module.exports = ErrorPages;
