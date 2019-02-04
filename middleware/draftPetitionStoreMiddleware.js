const CONF = require('config');
const logger = require('./services/logger').logger(__filename);
const transformationServiceClient = require('./services/transformationServiceClient');
const mockedClient = require('mocks/services/transformationServiceClient');
const parseRequest = require('./services/parseRequest');
const httpStatus = require('http-status-codes');
const { isEmpty } = require('lodash');
const statusCode = require('./services/statusCode');
const fetch = require('node-fetch');

let hadFetchedFromDraftStore = false;

// Properties that should be removed from the session before saving to draft store
const blacklistedProperties = [
  'expires',
  'cookie',
  'sessionKey',
  'saveAndResumeUrl',
  'submissionStarted',
  'csrfSecret'
];

// const options = {
//   draftBaseUrl: CONF.services.transformation.draftBaseUrl,
//   baseUrl: CONF.services.transformation.baseUrl
// };
const options = {
  draftBaseUrl: '',
  baseUrl: ''
};

const production = CONF.environment === 'production';
const client = production ? transformationServiceClient.init(options) : mockedClient;

const checkYourAnswers = '/check-your-answers';
const authTokenString = 'mockIdamUserDetailss';

const redirectToCheckYourAnswers = (req, res, next) => {
  const isCheckYourAnswers = req.originalUrl === checkYourAnswers;

  if (isCheckYourAnswers) {
    next();
  } else {
    res.redirect(checkYourAnswers);
  }
};

const removeBlackListedPropertiesFromSession = session => blacklistedProperties
  .reduce((acc, item) => {
    delete acc[item];
    return acc;
  }, Object.assign({}, session));

const restoreFromDraftStore = (req, res, next) => {
  // eslint-disable-next-line
  console.log('=== restoreFromDraftStore');
  // Get user token.
  let authToken = false;
  if (req.cookies && req.cookies[authTokenString]) {
    authToken = req.cookies[authTokenString];
  }

  // test to see if we have already restored draft store
  // const hadFetchedFromDraftStore = req.session && req.session.hasOwnProperty('fetchedDraft');
  const mockResponse = req.cookies.mockRestoreSession === 'true';
  const restoreSession = !hadFetchedFromDraftStore && (mockResponse || authToken);

  if (!restoreSession) {
    return next();
  }

  // set flag so we do not attempt to restore from draft store again
  // req.session.fetchedDraft = true;
  hadFetchedFromDraftStore = true;

  return fetch('http://localhost:3003/appeal')
    .then(response => response.json())
    .then(restoredSession => {
      // eslint-disable-next-line
      console.log('==============');
      // eslint-disable-next-line
      console.log(restoredSession);
      // eslint-disable-next-line
      console.log('==============');
      if (restoredSession && !isEmpty(restoredSession)) {
        Object.assign(req.session,
          removeBlackListedPropertiesFromSession(restoredSession));
        redirectToCheckYourAnswers(req, res, next);
      } else {
        next();
      }
    });


  // attempt to restore session from draft petition store
  // return client.restoreFromDraftStore(authToken, mockResponse)
  //   .then(restoredSession => {
  //     if (restoredSession && !isEmpty(restoredSession)) {
  //       Object.assign(req.session,
  //         removeBlackListedPropertiesFromSession(restoredSession));
  //       redirectToCheckYourAnswers(req, res, next);
  //     } else {
  //       next();
  //     }
  //   })
  //   .catch(error => {
  //     if (error.statusCode !== httpStatus.NOT_FOUND) {
  //       logger.errorWithReq(req, 'restore_draft_error', 'Error restoring draft', error.message);
  //     }
  //     next();
  //   });
};

const removeFromDraftStore = (req, res, next) => {
  // eslint-disable-next-line
  console.log('=== removeFromDraftStore');
  let authToken = false;
  if (req.cookies && req.cookies[authTokenString]) {
    authToken = req.cookies[authTokenString];
  }

  return client.removeFromDraftStore(authToken)
    .then(() => {
      next();
    })
    .catch(error => {
      if (error.statusCode !== httpStatus.NOT_FOUND) {
        logger.errorWithReq(req, 'remove_draft_error', 'Error removing draft', error.message);
        return res.redirect('/generic-error');
      }
      return next();
    });
};

const saveSessionToDraftStore = (req, res, next) => {
  // eslint-disable-next-line
  console.log('=== saveSessionToDraftStore');
  const { session, method } = req;
  const hasErrors = session.flash && session.flash.errors;
  const isPost = method.toLowerCase() === 'post';

  if (hasErrors || !isPost || req.headers['x-save-draft-session-only']) {
    return next();
  }

  const sessionToSave = removeBlackListedPropertiesFromSession(session);

  // Get user token.
  let authToken = '';
  if (req.cookies && req.cookies[authTokenString]) {
    authToken = req.cookies[authTokenString];
  }

  return client.saveToDraftStore(authToken, sessionToSave)
    .then(() => {
      next();
    })
    .catch(error => {
      logger.errorWithReq(req, 'save_draft_error', 'Error saving draft', error.message);
      next();
    });
};

const saveSessionToDraftStoreAndReply = function(req, res, next) {
  // eslint-disable-next-line
  console.log('=== saveSessionToDraftStoreAndReply');
  if (req.headers['x-save-draft-session-only']) {
    const authToken = req.cookies[authTokenString] || '';
    // eslint-disable-next-line no-invalid-this
    Object.assign(req.session, parseRequest.parse(this, req));
    const session = removeBlackListedPropertiesFromSession(req.session);

    return client
      .saveToDraftStore(authToken, session)
      .then(() => {
        res
          .status(statusCode.OK)
          .json({ message: 'ok' });
      })
      .catch(error => {
        logger.errorWithReq(
          req,
          'save_draft_and_reply_error',
          'Error saving draft and reply',
          error.message
        );
        res
          .status(statusCode.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error saving session to draft store' });
      });
  }

  return next();
};

const applyCtxToSession = (ctx, session) => {
  Object.assign(session, ctx);
  return session;
};


// use `function` instead of `arrow function (=>)` to preserve scope set in step.js #router
// this. refers to Step class or inheritance of (app/core/steps/Step)
const saveSessionToDraftStoreAndClose = function(req, res, next) {
  // eslint-disable-next-line
  console.log('=== saveSessionToDraftStoreAndClose');
  const { method, body } = req;

  const isPost = method.toLowerCase() === 'post';
  const hasSaveAndCloseBody = body && body.saveAndClose;

  if (isPost && hasSaveAndCloseBody) {
    // const ctx = this.parseRequest(req); // eslint-disable-line no-invalid-this
    const ctx = parseRequest.parse(this, req); // eslint-disable-line no-invalid-this
    const session = applyCtxToSession(ctx, req.session); // eslint-disable-line no-invalid-this
    const sessionToSave = removeBlackListedPropertiesFromSession(session);

    // Get user token.
    // let authToken = '';
    // if (req.cookies && req.cookies[authTokenString]) {
    //   authToken = req.cookies[authTokenString];
    // }

    // const sendEmail = true;

    // const responseBody = { answer: `${new Date()}` };

    fetch('http://localhost:3003/appeal', {
      method: 'post',
      body: JSON.stringify(sessionToSave),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json); // eslint-disable-line
        return json;
      });

    // client.saveToDraftStore(authToken, sessionToSave, sendEmail)
    //   .then(() => {
    //     res.redirect(this.steps.ExitApplicationSaved.url); // eslint-disable-line no-invalid-this
    //   })
    //   .catch(error => {
    //     logger.errorWithReq(
    //       req,
    //       'save_draft_and_close_error',
    //       'Error restoring draft',
    //       error.message
    //     );
    //     res.redirect('/generic-error');
    //   });
  } else {
    next();
  }
};

module.exports = {
  restoreFromDraftStore,
  removeFromDraftStore,
  redirectToCheckYourAnswers,
  saveSessionToDraftStoreAndClose,
  saveSessionToDraftStore,
  saveSessionToDraftStoreAndReply
};
