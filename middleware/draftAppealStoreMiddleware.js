const { Question, EntryPoint, Redirect } = require('@hmcts/one-per-page');
const request = require('superagent');
const config = require('config');
const Base64 = require('js-base64').Base64;

let allowSaveAndReturn = config.get('features.allowSaveAndReturn.enabled') === 'true';

const authTokenString = '__auth-token';

const idam = require('middleware/idam');
const logger = require('logger');

const logPath = 'draftAppealStoreMiddleware.js';

const setFeatureFlag = value => {
  allowSaveAndReturn = value;
};

const saveToDraftStore = (req, res, next) => {
  let values = null;

  try {
    values = req.journey.values;
  } catch (error) {
    logger.trace('Save to draft store, journey values not ready.', logPath);
  }

  if (allowSaveAndReturn && req.idam && values) {
    // send to draft store
    request.put(req.journey.settings.apiDraftUrl)
      .send(values)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${req.cookies[authTokenString]}`)
      .then(result => {
        logger.trace([
          'Successfully posted a draft',
          result.status
        ], logPath);

        logger.trace(`PUT api:${req.journey.settings.apiDraftUrl} status:${result.status}`,
          logPath);
        next();
      })
      .catch(error => {
        logger.exception(error, logPath);
        next();
      });
  } else {
    next();
  }
};

const restoreUserSession = (req, values) => {
  Object.assign(req.session, values);
};

const restoreUserState = (req, res, next) => {
  if (allowSaveAndReturn && req.idam) {
    restoreUserSession(req, { isUserSessionRestored: false });
    // First try to restore from idam state parameter
    if (req.query.state) {
      restoreUserSession(req, JSON.parse(Base64.decode(req.query.state)));
    }

    // Try to Restore from backend if user already have a saved data.
    request.get(req.journey.settings.apiDraftUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${req.cookies[authTokenString]}`)
      .then(result => {
        logger.trace([
          'Successfully get a draft',
          result.status
        ], logPath);

        if (result.body) {
          result.body.isUserSessionRestored = true;
          result.body.entryPoint = 'Entry';
          restoreUserSession(req, result.body);
        }
        next();
      })
      .catch(error => {
        logger.exception(error, logPath);
        next();
      });
  } else {
    next();
  }
};

class SaveToDraftStore extends Question {
  next() {
    super.next();
  }

  get middleware() {
    return [
      ...super.middleware,
      this.journey.collectSteps,
      saveToDraftStore
    ];
  }
}
// step which restores from the draft store
class RestoreUserState extends Redirect {
  next() {
    super.next();
  }

  get middleware() {
    return [
      idam.landingPage,
      restoreUserState,
      this.journey.collectSteps,
      ...super.middleware,
      saveToDraftStore
    ];
  }
}
class RestoreFromDraftStore extends EntryPoint {
  next() {
    super.next();
  }

  get middleware() {
    return [
      ...super.middleware,
      restoreUserState
    ];
  }
}


module.exports = {
  setFeatureFlag,
  SaveToDraftStore,
  saveToDraftStore,
  RestoreUserState,
  restoreUserState,
  RestoreFromDraftStore,
  restoreUserSession
};