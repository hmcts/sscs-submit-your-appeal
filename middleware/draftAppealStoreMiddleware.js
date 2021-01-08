const { Question, EntryPoint, Redirect, Page } = require('@hmcts/one-per-page');
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

const multipleDraftsEnabled = config.get('features.multipleDraftsEnabled.enabled') === 'true';

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

const updateDraftInDraftStore = async(req, res, next, values) => {
  values.ccdCaseId = req.session.ccdCaseId;

  console.log(`Updating draft case id ${req.session.ccdCaseId}`);
  await request.post(req.journey.settings.apiDraftUrl)
    .send(values)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${req.cookies[authTokenString]}`)
    .then(result => {
      logger.trace([
        'Successfully updated a draft for case with nino: ' +
        `${(values && values.appellant && values.appellant.nino) ?
          values.appellant.nino :
          'no NINO submited yet'}`, result.status
      ], logPath);

      logger.trace(`PUT api:${req.journey.settings.apiDraftUrl} status:${result.status}`,
        logPath);

      next();
    })
    .catch(error => {
      logger.trace('Exception on updating a draft for case with nino: ' +
        `${(values && values.appellant && values.appellant.nino) ?
          values.appellant.nino :
          'no NINO submitted yet'}`, logPath);
      logger.exception(error, logPath);
      if (req && req.journey && req.journey.steps) {
        redirectTo(req.journey.steps.Error500).redirect(req, res, next);
      } else {
        next();
      }
    });
}

const createDraftInDraftStore = async(req, res, next, values) => {
  await request.put(req.journey.settings.apiDraftUrlCreate)
    .send(values)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${req.cookies[authTokenString]}`)
    .then(result => {
      logger.trace([
        'Successfully created a draft for case with nino: ' +
        `${(values && values.appellant && values.appellant.nino) ?
          values.appellant.nino :
          'no NINO submited yet'}`, result.status
      ], logPath);

      logger.trace(`PUT api:${req.journey.settings.apiDraftUrl} status:${result.status}`,
        logPath);

      Object.assign(req.session, { ccdCaseId: result.body.id });

      next();
    })
    .catch(error => {
      logger.trace('Exception on creating a draft for case with nino: ' +
        `${(values && values.appellant && values.appellant.nino) ?
          values.appellant.nino :
          'no NINO submitted yet'}`, logPath);
      logger.exception(error, logPath);
      if (req && req.journey && req.journey.steps) {
        redirectTo(req.journey.steps.Error500).redirect(req, res, next);
      } else {
        next();
      }
    });
}

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

    if (req.session && req.session.ccdCaseId) {
      await updateDraftInDraftStore(req, res, next, values);
    } else {
      await createDraftInDraftStore(req, res, next, values);
    }
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
    console.log('Skipped Restoring User State');
    next();
  }
};

const restoreAllDraftsState = async(req, res, next) => {
  if (allowSaveAndReturn && req.idam) {
    console.log('Attempt Restoring All Drafts State');
    Object.assign(req.session, { isUserSessionRestored: false });
    // First try to restore from idam state parameter
    if (req.query.state) {
      Object.assign(req.session, JSON.parse(Base64.decode(req.query.state)));
    }

    // Try to Restore from backend if user already have a saved data.
    await request.get(req.journey.settings.apiAllDraftUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${req.cookies[authTokenString]}`)
      .then(result => {
        console.log('Successfully get all drafts');
        logger.trace([
          'Successfully get all drafts',
          result.status
        ], logPath);

        if (result.body) {
          console.log('Got Body');
          if (multipleDraftsEnabled) {
            console.log('Multiple Drafts');
            const shimmed = {};
            const drafts = result.body;
            const draftObj = {};

            for (const draft of drafts) {
              draftObj[draft.ccdCaseId] = draft;
            }

            shimmed.drafts = draftObj;
            shimmed.isUserSessionRestored = true;
            shimmed.entryPoint = 'Entry';
            console.log(shimmed);
            Object.assign(req.session, shimmed);
          } else {
            console.log('Not Multiple Drafts');
            let shimmed = {};
            if (Array.isArray(result.body) && result.body.length > 0) {
              shimmed = result.body[0];
            }
            shimmed.isUserSessionRestored = true;
            shimmed.entryPoint = 'Entry';
            Object.assign(req.session, shimmed);
          }
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
    console.log('Skipped Restoring All Drafts');
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

class AuthAndRestoreAllDraftsState extends Redirect {
  get middleware() {
    return [
      idam.landingPage,
      restoreAllDraftsState,
      ...super.middleware
    ];
  }
}

class RestoreAllDraftsState extends Page {
  get middleware() {
    return [
      restoreAllDraftsState,
      ...super.middleware
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
  AuthAndRestoreAllDraftsState,
  restoreAllDraftsState,
  RestoreFromDraftStore,
  SaveToDraftStoreAddAnother,
  removeRevertInvalidSteps,
  SaveToDraftStoreCYA,
  RestoreAllDraftsState,
  updateDraftInDraftStore,
  createDraftInDraftStore
};
