const { Question, EntryPoint, Redirect } = require('@hmcts/one-per-page');
const request = require('request-promise-native');
const { omit } = require('lodash');
const config = require('config');
const Base64 = require('js-base64').Base64;

const allowSaveAndReturn = config.get('features.allowSaveAndReturn.enabled') === 'true';
const headers = { 'content-type': 'application/json' };
const blackList = [ 'cookie', 'expires' ];


const saveToDraftStore = (req, res, next) => {
  if (allowSaveAndReturn && req.session.uuid) {
    const uri = req.journey.settings.draftUrl;
    // remove any unwanted items from session
    let body = omit(req.session, blackList);
    // get session to save
    body = JSON.stringify(body);
    // send to draft store
    request.post({ uri, body, headers })
      .then(() => {
        next();
      })
      .catch(error => {
        throw error;
      });
  } else {
    next();
  }
};
const restoreFromDraftStore = (req, res, next) => {
  if (allowSaveAndReturn && req.session.uuid) {
    const uri = req.journey.settings.draftUrl;
    // send to draft store
    request.get({ uri })
      .then(body => {
        Object.assign(req.session, JSON.parse(body));
        next();
      })
      .catch(error => {
        throw error;
      });
  } else {
    next();
  }
};

const restoreFromIdamState = (req, res, next) => {
  if (allowSaveAndReturn && req.query.state) {
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
      ...super.middleware,
      restoreFromIdamState,
      saveToDraftStore
    ];
  }
}


module.exports = {
  SaveToDraftStore,
  saveToDraftStore,
  RestoreFromDraftStore,
  restoreFromDraftStore,
  RestoreFromIdamState,
  restoreFromIdamState
};