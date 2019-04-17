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
const restoreFromDraftStore = (req, res, next) => {
  next();
};

const restoreFromIdamState = (req, res, next) => {
  if (allowSaveAndReturn && req.query.state && req.idam) {
    Object.assign(
      req.session,
      JSON.parse(
        Base64.decode(req.query.state)
      )
    );
  }
  next();
};
class SaveToDraftStore extends Question {
  get middleware() {
    return [
      ...super.middleware,
      this.journey.collectSteps,
      saveToDraftStore
    ];
  }
}
// step which restores from the draft store
class RestoreFromDraftStore extends EntryPoint {
  get middleware() {
    return [
      ...super.middleware,
      restoreFromDraftStore
    ];
  }
}

class RestoreFromIdamState extends Redirect {
  get middleware() {
    return [
      idam.landingPage,
      restoreFromIdamState,
      this.journey.collectSteps,
      ...super.middleware,
      saveToDraftStore
    ];
  }
}


module.exports = {
  setFeatureFlag,
  SaveToDraftStore,
  saveToDraftStore,
  RestoreFromDraftStore,
  restoreFromDraftStore,
  RestoreFromIdamState,
  restoreFromIdamState
};