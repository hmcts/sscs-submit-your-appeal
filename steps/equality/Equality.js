const { goTo } = require('@hmcts/one-per-page');
const { form, text, object } = require('@hmcts/one-per-page/forms');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { v4: uuidv4 } = require('uuid');
const paths = require('paths');
const config = require('config');
const request = require('request-promise');
const logger = require('logger');
const Joi = require('joi');
const createToken = require('./createToken');

class Equality extends SaveToDraftStore {
  static get path() {
    return paths.equalityAndDiversity;
  }

  isEnabled() {
    return config.features.equalityAndDiversity.enabled === 'true';
  }

  handler(req, res, next) {
    const skipPcq = () => this.next().redirect(req, res, next);

    // If enabled and not already called
    if (this.isEnabled() && !req.session.Equality) {
      // Check PCQ Health
      const uri = `${config.services.equalityAndDiversity.url}/health`;
      request.get({ uri, json: true })
        .then(json => {
          if (json.status && json.status === 'UP') {
            this.invokePcq(req, res);
          } else {
            logger.trace('PCQ service is DOWN');
            skipPcq();
          }
        })
        .catch(error => {
          logger.trace(error.message);
          skipPcq();
        });
    } else {
      skipPcq();
    }
  }

  invokePcq(req, res) {
    const pcqId = uuidv4();
    const params = {
      serviceId: 'SSCS',
      actor: 'APPELLANT',
      pcqId,
      partyId: req.idam ? req.idam.userDetails.email : 'No IDAM',
      returnUrl: req.headers.host + paths.checkYourAppeal,
      language: 'en'
    };

    params.token = createToken(params);

    const qs = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');

    const equalityForm = {
      body: {
        'equality.pcqId': pcqId
      }
    };
    this.fields = this.form.parse(equalityForm);
    this.store();

    res.redirect(`${config.services.equalityAndDiversity.url}${config.services.equalityAndDiversity.path}?${qs}`);
  }

  get form() {
    const fields = {
      pcqId: text.joi('', Joi.string())
    };

    const equality = object(fields);

    return form({ equality });
  }

  answers() {
    return [];
  }

  values() {
    const pcqId = this.fields.equality.pcqId.value;
    return pcqId ? { pcqId } : {};
  }

  next() {
    return goTo(this.journey.steps.CheckYourAppeal);
  }
}

module.exports = Equality;
