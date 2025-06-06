const { Question, EntryPoint, Redirect, Page } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { AddAnother } = require('@hmcts/one-per-page/steps');
const request = require('superagent');
const config = require('config');
const Base64 = require('js-base64').Base64;
const { get } = require('lodash');
const { maskNino } = require('utils/stringUtils');

/* eslint-disable max-lines */
const {
  CheckYourAnswers: CYA
} = require('@hmcts/one-per-page/checkYourAnswers');

let allowSaveAndReturn =
  config.get('features.allowSaveAndReturn.enabled') === 'true';

const authTokenString = '__auth-token';
const idam = require('middleware/idam');
const logger = require('logger');
const {
  activeProperty
} = require('@hmcts/one-per-page/src/session/sessionShims');

const logPath = 'draftAppealStoreMiddleware.js';

const setFeatureFlag = value => {
  allowSaveAndReturn = value;
};

const resetJourney = req => {
  // One Per Page doesn't natively support multiple journeys or reseting just journey data
  // within session so roll our own. Below should withstand future changes to the journey
  // as we are only preserving the meta data, drafts and cookie. Anything else is journey data.

  const keysToKeep = [
    'cookie',
    'entryPoint',
    'isUserSessionRestored',
    'drafts',
    'active',
    'hydrate',
    'dehydrate',
    'generate',
    'save'
  ];

  const allKeys = Object.keys(req.session);
  const keysToDelete = allKeys.filter(key => !keysToKeep.includes(key));

  for (const keyToDelete of keysToDelete) {
    delete req.session[keyToDelete];
  }
  if (!req.session[activeProperty]) {
    req.session[activeProperty] = true;
  }
  req.session.save();
};

const parseErrorResponse = error => {
  const parsedErrorObj = error;
  const dataToRemove = '_data';
  const headerToRemove = '_header';
  if (
    parsedErrorObj.response &&
    parsedErrorObj.response.request &&
    parsedErrorObj.response.request._data
  ) {
    delete parsedErrorObj.response.request[dataToRemove];
  }
  if (
    parsedErrorObj.response &&
    parsedErrorObj.response.request &&
    parsedErrorObj.response.request._header
  ) {
    delete parsedErrorObj.response.request[headerToRemove];
  }
  return JSON.stringify(parsedErrorObj);
};

const removeRevertInvalidSteps = (journey, callBack) => {
  try {
    if (journey.values) {
      const allVisitedSteps = [...journey.visitedSteps];
      // filter valid visitedsteps.
      journey.visitedSteps = journey.visitedSteps.filter(step => step.valid);
      // use only valid steps.
      if (typeof callBack === 'function') {
        callBack();
      }
      // Revert visitedsteps back to initial state.
      journey.visitedSteps = allVisitedSteps;
    }
  } catch {
    logger.trace(
      'removeRevertInvalidSteps invalid steps, or callback function',
      logPath
    );
  }
};

const handleDraftCreateUpdateFail = (error, req, res, next, values) => {
  logger.trace(
    'Exception on creating/updating a draft for case with nino: ' +
      `${maskNino(get(values, 'appellant.nino'))}`,
    logPath
  );
  logger.exception(parseErrorResponse(error), logPath);
  if (req && req.journey && req.journey.steps) {
    redirectTo(req.journey.steps.Error500).redirect(req, res, next);
  } else {
    next();
  }
};

const deleteDraft = async(req, caseId) => {
  let values = null;

  if (allowSaveAndReturn) {
    removeRevertInvalidSteps(req.journey, () => {
      values = req.journey.values;
    });
  }

  logger.trace(
    `deleteDraft - Benefit Type ${values && values.benefitType ? values.benefitType.code : 'null'}`
  );

  values.ccdCaseId = caseId;
  await request
    .delete(`${req.journey.settings.apiDraftUrl}/${caseId}`)
    .send(values)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${req.cookies[authTokenString]}`)
    .then(result => {
      logger.trace(
        [
          `Successfully deleted a draft for case with caseId: ${caseId}`,
          result.status
        ],
        logPath
      );

      logger.trace(
        `DELETE api:${req.journey.settings.apiDraftUrl} status:${result.status}`,
        logPath
      );

      delete req.session.drafts[caseId];
      req.session.save();
    })
    .catch(error => {
      logger.trace(
        `Exception on archiving a draft for case with caseId: ${caseId}`,
        logPath
      );
      logger.exception(parseErrorResponse(error), logPath);
    });
};

const updateDraftInDraftStore = async(req, res, next, values) => {
  values.ccdCaseId = req.session.ccdCaseId;

  logger.trace(
    `updateDraftInDraftStore - Benefit Type ${values && values.benefitType ? values.benefitType.code : 'null'}`
  );
  await request
    .post(req.journey.settings.apiDraftUrl)
    .send(values)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${req.cookies[authTokenString]}`)
    .then(result => {
      logger.trace(
        [
          'Successfully updated a draft for case with nino: ' +
            `${maskNino(get(values, 'appellant.nino'))}`,
          result.status
        ],
        logPath
      );

      logger.trace(
        `POST api:${req.journey.settings.apiDraftUrl} status:${result.status}`,
        logPath
      );

      next();
    })
    .catch(error => {
      handleDraftCreateUpdateFail(error, req, res, next, values);
    });
};

const createDraftInDraftStore = async(req, res, next, values) => {
  logger.trace(
    `createDraftInDraftStore - Benefit Type ${values && values.benefitType ? values.benefitType.code : 'null'}`
  );
  await request
    .put(req.journey.settings.apiDraftUrlCreate)
    .send(values)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${req.cookies[authTokenString]}`)
    .then(result => {
      logger.trace(
        [
          'Successfully created a draft for case with nino: ' +
            `${maskNino(get(values, 'appellant.nino'))}`,
          result.status
        ],
        logPath
      );

      logger.trace(
        `PUT api:${req.journey.settings.apiDraftUrlCreate} status:${result.status}`,
        logPath
      );

      Object.assign(req.session, { ccdCaseId: result.body.id });

      next();
    })
    .catch(error => {
      handleDraftCreateUpdateFail(error, req, res, next, values);
    });
};

// eslint-disable-next-line
const saveToDraftStore = async (req, res, next) => {
  let values = null;
  if (allowSaveAndReturn) {
    removeRevertInvalidSteps(req.journey, () => {
      values = req.journey.values;
      logger.trace(
        `saveToDraftStore - Benefit Type ${values && values.benefitType ? values.benefitType.code : 'null'}`
      );
    });
  }

  if (allowSaveAndReturn && req.idam && values) {
    logger.trace(
      `Create/Post draft for CCD Id ${values && values.id ? values.id : null} , IDAM id: ${req.idam.userDetails.id} on page ${req.path}`
    );
    if (req.session && req.session.ccdCaseId) {
      logger.trace(
        `About to update draft for Session CaseId: ${req.session.ccdCaseId}`
      );
      await updateDraftInDraftStore(req, res, next, values);
    } else {
      logger.trace('About to create new draft');
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
    await request
      .get(req.journey.settings.apiDraftUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${req.cookies[authTokenString]}`)
      .then(result => {
        logger.trace(['Successfully get a draft', result.status], logPath);

        logger.trace(
          `GET api:${req.journey.settings.apiDraftUrl} status:${result.status}`,
          logPath
        );

        if (result.body) {
          result.body.isUserSessionRestored = true;
          result.body.entryPoint = 'Entry';
          Object.assign(req.session, result.body);
        }
        logger.trace(
          `restoreUserState - Benefit Type in session ${req.session.benefitType ? req.session.benefitType.code : 'null'}`
        );
        next();
      })
      .catch(error => {
        Object.assign(req.session, {
          entryPoint: 'Entry'
        });
        logger.exception(parseErrorResponse(error), logPath);
        next();
      });
  } else {
    next();
  }
};

const restoreAllDraftsState = async(req, res, next) => {
  if (allowSaveAndReturn && req.idam) {
    Object.assign(req.session, { isUserSessionRestored: false });
    // First try to restore from idam state parameter
    if (req.query.state) {
      Object.assign(req.session, JSON.parse(Base64.decode(req.query.state)));
    }

    // Try to Restore from backend if user already have a saved data.
    await request
      .get(req.journey.settings.apiAllDraftUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${req.cookies[authTokenString]}`)
      .then(result => {
        logger.trace(['Successfully get all drafts', result.status], logPath);

        if (result.body) {
          const shimmed = {};
          const drafts = result.body;
          const draftObj = {};
          if (Array.isArray(drafts) && drafts.length > 0) {
            for (const draft of drafts) {
              draftObj[draft.ccdCaseId] = draft;
            }
          }
          shimmed.drafts = draftObj;
          shimmed.isUserSessionRestored = true;
          shimmed.entryPoint = 'Entry';
          Object.assign(req.session, shimmed);
        }
        logger.trace(
          `restoreAllDraftsState - Benefit Type in session ${req.session.benefitType ? req.session.benefitType.code : 'null'}`
        );
        next();
      })
      .catch(error => {
        Object.assign(req.session, {
          entryPoint: 'Entry'
        });
        logger.exception(parseErrorResponse(error), logPath);
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
    return [...super.middleware, this.journey.collectSteps, saveToDraftStore];
  }
}

class SaveToDraftStoreCYA extends CYA {
  get isUserLoggedIn() {
    return this.req.idam;
  }
  get middleware() {
    return [...super.middleware, this.journey.collectSteps, saveToDraftStore];
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
    return [...super.middleware, this.journey.collectSteps, saveToDraftStore];
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
      this.journey.collectSteps,
      saveToDraftStore,
      restoreAllDraftsState,
      ...super.middleware
    ];
  }
}

class LoadJourneyAndRedirect extends Redirect {
  get middleware() {
    return [this.journey.collectSteps, ...super.middleware];
  }
}

class RestoreAllDraftsState extends Page {
  get middleware() {
    return [restoreAllDraftsState, ...super.middleware];
  }
}

class RestoreFromDraftStore extends EntryPoint {
  get isUserLoggedIn() {
    return this.req.idam;
  }
  get middleware() {
    return [...super.middleware, restoreUserState];
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
  createDraftInDraftStore,
  deleteDraft,
  LoadJourneyAndRedirect,
  resetJourney,
  handleDraftCreateUpdateFail
};
