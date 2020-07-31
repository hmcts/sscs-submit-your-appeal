const { Question, EntryPoint, Redirect } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { AddAnother } = require('@hmcts/one-per-page/steps');
const request = require('superagent');
const config = require('config');
const Base64 = require('js-base64').Base64;

const {
  CheckYourAnswers: CYA
} = require('@hmcts/one-per-page/checkYourAnswers');

let allowSaveAndReturn = config.get('features.allowSaveAndReturn.enabled') === 'true';

const authTokenString = '__auth-token';
const idam = require('middleware/idam');
const logger = require('logger');

const logPath = 'draftAppealStoreMiddleware.js';

const setFeatureFlag = value => {
  allowSaveAndReturn = value;
};

const removeRevertInvalidSteps = (journey, callBack) => {
  try {
    const allVisitedSteps = [...journey.visitedSteps];
    // filter valid visitedsteps.
    journey.visitedSteps = journey.visitedSteps.filter(step => step.valid);
    // use only valid steps.
    if (typeof callBack === 'function') {
      callBack();
    }
    // Revert visitedsteps back to initial state.
    journey.visitedSteps = allVisitedSteps;
  } catch (error) {
    logger.trace('removeRevertInvalidSteps invalid steps, or callback function', logPath);
  }
};

const saveToDraftStore = async(req, res, next) => {
  let values = null;

  if (allowSaveAndReturn) {
    removeRevertInvalidSteps(req.journey, () => {
      values = req.journey.values;
    });
  }

  if (allowSaveAndReturn && req.idam && values) {
    logger.trace(`About to post draft for CCD Id ${(values && values.id) ? values.id : null}` +
        ` , IDAM id: ${req.idam.userDetails.id} on page ${req.path}`);
    logger.trace(`VALUES: ${values}`);
    logger.trace(`AUTH TOKEN: ${req.cookies[authTokenString]}`);
    // send to draft store
    await request.put(req.journey.settings.apiDraftUrl)
      .send(values)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${req.cookies[authTokenString]}`)
      .then(result => {
        logger.trace([
          'Successfully posted a draft for case with nino: ' +
          `${(values && values.appellant && values.appellant.nino) ?
            values.appellant.nino :
            'no NINO submited yet'}`, result.status
        ], logPath);
        logger.trace(`PUT api:${req.journey.settings.apiDraftUrl} status:${result.status}`,
          logPath);
        next();
      })
      .catch(error => {
        logger.trace('Exception on posting a draft for case with nino: ' +
          `${(values && values.appellant && values.appellant.nino) ?
            values.appellant.nino :
            'no NINO submitted yet'}`, logPath);
        logger.trace(`ERROR: ${error}`, logPath);
        logger.exception(error, logPath);
        if (req && req.journey && req.journey.steps) {
          redirectTo(req.journey.steps.Error500).redirect(req, res, next);
        } else {
          next();
        }
      });
  } else {
    next();
  }
};

const restoreUserState = async(req, res, next) => {
  if (allowSaveAndReturn && req.idam) {
    Object.assign(req.session, { isUserSessionRestored: false });
    // First try to restore from idam state parameter
    if (req.query.state) {
      Object.assign(req.session, JSON.parse(Base64.decode(req.query.state)));
    }

    // Try to Restore from backend if user already have a saved data.
    await request.get(req.journey.settings.apiDraftUrl)
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
          Object.assign(req.session, result.body);
        }
        next();
      })
      .catch(error => {
        Object.assign(req.session, {
          entryPoint: 'Entry'
        });
        logger.exception(error, logPath);
        next();
      });
  } else {
    next();
  }
};

class SaveToDraftStoreAddAnother extends AddAnother {
  get isUserLoggedIn() {
    return this.req.idam;
  }

  get continueText() {
    if (this.req.idam) {
      return 'saveAndContinue';
    }

    return 'continue';
  }

  get middleware() {
    return [
      ...super.middleware,
      this.journey.collectSteps,
      saveToDraftStore
    ];
  }
}

class SaveToDraftStoreCYA extends CYA {
  get isUserLoggedIn() {
    return this.req.idam;
  }
  get middleware() {
    return [
      ...super.middleware,
      this.journey.collectSteps,
      saveToDraftStore
    ];
  }
}

class SaveToDraftStore extends Question {
  get isUserLoggedIn() {
    return this.req.idam;
  }

  get continueText() {
    if (this.req.idam) {
      return 'saveAndContinue';
    }

    return 'continue';
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
  get isUserLoggedIn() {
    return this.req.idam;
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
  SaveToDraftStoreAddAnother,
  removeRevertInvalidSteps,
  SaveToDraftStoreCYA
};
