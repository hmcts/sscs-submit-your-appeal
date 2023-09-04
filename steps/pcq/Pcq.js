const { goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { v4: uuidv4 } = require('uuid');
const paths = require('paths');
const config = require('config');
const request = require('@cypress/request-promise');
const logger = require('logger');
const Joi = require('joi');
const createToken = require('./createToken');
const i18next = require('i18next');

class Pcq extends SaveToDraftStore {
  static get path() {
    return paths.pcq;
  }

  isEnabled() {
    return process.env.PCQ_ENABLED === 'true' || config.features.pcq.enabled === 'true';
  }

  handler(req, res, next) {
    const skipPcq = () => this.next().redirect(req, res, next);

    // PCQ is enabled and not already called
    if (this.isEnabled() && !req.session.Pcq) {
      // Check PCQ Health
      const uri = `${config.services.pcq.url}/health`;
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
      partyId: req.idam ? req.idam.userDetails.email : 'anonymous',
      returnUrl: req.headers.host + paths.checkYourAppeal,
      language: i18next.language
    };

    params.token = createToken(params);

    // Encode partyId
    params.partyId = encodeURIComponent(params.partyId);

    const qs = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');

    const pcqForm = {
      body: {
        pcqId
      }
    };
    this.fields = this.form.parse(pcqForm);
    this.store();

    res.redirect(`${config.services.pcq.url}${config.services.pcq.path}?${qs}`);
  }

  get form() {
    return form({ pcqId: text.joi('', Joi.string()) });
  }

  answers() {
    return [];
  }

  values() {
    const pcqId = this.fields.pcqId.value;
    return pcqId ? { pcqId } : {};
  }

  next() {
    return goTo(this.journey.steps.CheckYourAppeal);
  }
}

module.exports = Pcq;
