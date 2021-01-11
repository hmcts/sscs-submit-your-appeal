const paths = require('paths');
const { Redirect } = require('@hmcts/one-per-page');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');

const multipleDraftsEnabled = config.get('features.multipleDraftsEnabled.enabled') === 'true';

class NewAppeal extends Redirect {
  static get path() {
    return paths.newAppeal;
  }

  handler(req, res, next) {
    if (multipleDraftsEnabled && req.method === 'GET') {
      this.resetJourney(req);
      res.redirect(paths.start.benefitType);
    } else {
      super.handler(req, res, next);
    }
  }

  resetJourney(req) {
    // One Per Page doesn't natively support multiple journeys or reseting just journey data
    // within session so roll our own. Below should withstand future changes to the journey
    // as we are only preserving the meta data, drafts and cookie. Anything else is journey data.

    const keysToKeep = [
      'cookie', 'entryPoint', 'isUserSessionRestored', 'drafts', 'active',
      'hydrate', 'dehydrate', 'generate', 'save'
    ];

    // const allKeys = Object.keys(this.req.session);
    const allKeys = Object.keys(req.session);
    const keysToDelete = allKeys.filter(key => !keysToKeep.includes(key));

    for (const keyToDelete of keysToDelete) {
      delete req.session[keyToDelete];
    }
    req.session.save();
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = NewAppeal;
