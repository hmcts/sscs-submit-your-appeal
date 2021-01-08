const paths = require('paths');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');

class NewAppeal extends SaveToDraftStore {
  static get path() {
    return paths.newAppeal;
  }

  handler(req, res, next) {
    console.log('new appeal');

    this.resetJourney(req);

    res.redirect(paths.start.benefitType);
  }

  resetJourney(req) {
    // One Per Page doesn't natively support multiple journeys or reseting just journey data
    // within session so roll our own. Below should withstand future changes to the journey
    // as we are only preserving the meta data, drafts and cookie. Anything else is journey data.

    const keysToKeep = ['cookie', 'entryPoint', 'isUserSessionRestored', 'drafts', 'active',
      'hydrate', 'dehydrate', 'generate'];

    const allKeys = Object.keys(this.req.session);
    const keysToDelete = allKeys.filter(key => !keysToKeep.includes(key));

    for (var keyToDelete of keysToDelete) {
      delete req.session[keyToDelete];
    }
    req.session.save();
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = NewAppeal;
