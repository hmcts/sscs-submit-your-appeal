const i18next = require('i18next').createInstance();
const logger = require('logger');
const config = require('config');

function commonContentMiddleware(req, res, next) {
  const content = require(`app/content/common-${req.session.language}`);

  i18next.init(content, error => {
    if (error) {
      logger.trace('Failed to initialise i18next', error.message);
    }
  });

  i18next.languages = config.languages;
  i18next.changeLanguage(req.session.language);

  const i18nProxy = new Proxy(i18next, {
    get: (target, key) => {
      if (target.exists(key)) {
        return target.t(key, {
          pageUrl: req.baseUrl,
          smartSurveyFeedbackUrl: config.commonProps.smartSurveyFeedbackUrl,
          courtPhoneNumber: config.commonProps.courtPhoneNumber,
          courtOpeningHour: config.commonProps.courtOpeningHour,
          courtEmail: config.commonProps.courtEmail
        });
      }
      return '';
    }
  });

  req.i18n = i18next;
  res.locals.i18n = i18next;
  res.locals.common = i18nProxy;
  res.locals.content = i18nProxy;

  next();
}

module.exports = commonContentMiddleware;
