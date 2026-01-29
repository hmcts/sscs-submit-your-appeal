const i18Next = require('i18next');
const { defined } = require('../util/checks');
const { isDev } = require('../util/nodeEnv');
const defaultIfUndefined = require('../util/defaultIfUndefined');
const log = require('../util/logging')('i18Next');
const crypto = require('crypto');

const i18NextInstance = i18Next.init({ fallbackLng: 'en' });
i18NextInstance.contentBundles = {};

const getHash = (namespace, lang) => {
  const key = `${namespace}.${lang}`;
  if (defined(i18NextInstance.contentBundles[key])) {
    return i18NextInstance.contentBundles[key];
  }
  return '';
};
const saveHash = (namespace, lang, hash) => {
  i18NextInstance.contentBundles[`${namespace}.${lang}`] = hash;
};

i18NextInstance.addBundleIfModified = (
  lang, namespace, translations, deep, overwrite
) => {
  const hash = crypto.createHash('sha1')
    .update(JSON.stringify(translations))
    .digest('base64');

  const existingHash = getHash(namespace, lang);
  if (hash === existingHash) {
    log.debug(`Skipping ${namespace}.${lang} already added. Hash ${hash}`);
    return;
  }
  saveHash(namespace, lang, hash);
  log.debug(`Adding translations for ${namespace}.${lang}. Hash ${hash}`);
  i18NextInstance.addResourceBundle(
    lang, namespace, translations, deep, overwrite
  );
};

const configurei18n = (opts = {}) => {
  if (opts.filters) {
    i18NextInstance.translator.interpolator.format = (value, format) => {
      if (opts.filters.hasOwnProperty(format)) {
        if (typeof opts.filters[format] === 'function') {
          return opts.filters[format](value);
        }
        throw new Error(`${format} is not a valid filter`);
      }
      return value;
    };
    i18NextInstance.translator.interpolator.formatSeparator = '|';
  }
};

const i18nMiddleware = (req, res, next) => {
  if (!defined(req.i18Next)) {
    req.i18Next = i18NextInstance;
  }

  if (!defined(req.i18n)) {
    req.i18n = {
      t: i18NextInstance.t.bind(i18NextInstance),
      get availableLanguages() {
        const ns = req.currentStep.name;
        const allLangs = Object.keys(req.i18Next.services.resourceStore.data);

        return allLangs
          .filter(lang => ns in req.i18Next.services.resourceStore.data[lang])
          .map(lang => {
            return { code: lang, name: req.i18Next.t(lang) };
          });
      },
      get currentLanguage() {
        return defaultIfUndefined(req.i18Next.language, 'en');
      }
    };
  }

  if (defined(req.query) && defined(req.query.lng)) {
    req.i18Next.changeLanguage(req.query.lng);
  } else if (defined(req.cookies) && defined(req.cookies.i18n)) {
    req.i18Next.changeLanguage(req.cookies.i18n);
  } else {
    req.i18Next.changeLanguage('en');
  }

  res.cookie(
    'i18n',
    defaultIfUndefined(req.i18Next.language, 'en'),
    {
      secure: !isDev,
      httpOnly: !isDev
    }
  );

  next();
};

module.exports = { i18NextInstance, i18nMiddleware, configurei18n };
