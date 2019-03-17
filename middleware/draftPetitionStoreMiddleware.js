const { Question, EntryPoint, Redirect } = require('@hmcts/one-per-page');
const request = require('request-promise-native');
const { omit } = require('lodash');

const uri = 'http://localhost:3003/appeal';
const headers = { 'content-type': 'application/json' };

const blackList = [ 'cookie', 'expires' ];
const saveToDraftStore = (req, res, next) => {
  // remove any unwanted items from session
  let body = omit(req.session, blackList);
  // get session to save
  body = JSON.stringify(body);
  // send to draft store
  return request.post({ uri, body, headers })
    .then(() => {
      next();
    })
    .catch(error => {
      throw error;
    });
};
const restoreFromDraftStore = (req, res, next) =>
  // send to draft store
  request.get({ uri })
    .then(body => {
      Object.assign(req.session, JSON.parse(body));
      next();
    })
    .catch(error => {
      throw error;
    });

const restoreFromIdamState = (req, res, next) => {
  Object.assign(req.session, JSON.parse(req.query.state));
  next();
};
// step which saves to the draft store
// CAVIAT: middleware is ran before any new properties are saved to the session
// so you may want to figure our a way to run this after session has been updated with latest values
// may be somthing that should be built into OPP to happen after store
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
      restoreFromIdamState
    ];
  }
}


module.exports = {
  SaveToDraftStore,
  RestoreFromDraftStore,
  saveToDraftStore,
  restoreFromDraftStore,
  RestoreFromIdamState
};