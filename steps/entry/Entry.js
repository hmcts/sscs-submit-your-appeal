const { goTo } = require('@hmcts/one-per-page');
const { RestoreFromDraftStore } = require('middleware/draftPetitionStoreMiddleware');
const paths = require('paths');

class Entry extends RestoreFromDraftStore {
  static get path() {
    return paths.session.entry;
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = Entry;
