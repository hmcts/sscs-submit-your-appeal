const i18Next = require('i18next');
const { defined } = require('../util/checks');
const { isDev } = require('../util/nodeEnv');
const defaultIfUndefined = require('../util/defaultIfUndefined');
const log = require('../util/logging')('i18Next');
const crypto = require('crypto');
const logger = require('logger');

const ALLOWED_LANGUAGES = ['en', 'cy'];
const DEFAULT_LANG = 'en';

const sanitizeLanguage = lng => {
  if (typeof lng !== 'string' || !lng) {
    return DEFAULT_LANG;
  }
  const primary = lng.split('-')[0].toLowerCase();
  return ALLOWED_LANGUAGES.includes(primary) ? primary : DEFAULT_LANG;
};

// Create a dedicated i18next instance and initialize it with a callback.
// `i18next.init()` can return a Promise in newer versions; calling init with a
// callback ensures the instance methods (like `t`) are attached and usable.
const i18NextInstance = i18Next.createInstance();
i18NextInstance.init({ fallbackLng: 'en' }, error => {
  if (error) {
    logger.error('i18next failed to initialize', error);
  }
});

// Ensure minimal runtime surface is present even if init is async or fails.
// This prevents middleware from crashing when it binds methods like `t`.
if (typeof i18NextInstance.t !== 'function') {
  /* eslint-disable func-names */
  i18NextInstance.t = function(key) {
    return key;
  };
}
/* eslint-disable func-names */
if (typeof i18NextInstance.changeLanguage !== 'function') {
  i18NextInstance.changeLanguage = function(lng, normaliseLanguage) {
    // Normalize language codes to primary subtag (e.g., 'en-GB' -> 'en') and
    // validate against allowed languages so dynamic requires cannot traverse paths.
    const normalized = sanitizeLanguage(lng);
    i18NextInstance.language = normalized;
    if (typeof normaliseLanguage === 'function') normaliseLanguage();
    return Promise.resolve();
  };
}
// Provide a minimal resourceStore structure expected by code that inspects it.
i18NextInstance.services = i18NextInstance.services || {};
/* eslint-disable id-blacklist */
i18NextInstance.services.resourceStore = i18NextInstance.services.resourceStore || { data: {} };

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
/* eslint-disable complexity */
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
  // Some versions of i18next used in consumers don't expose `addResourceBundle`.
  // Fall back to writing directly into the resourceStore and reload if required.
  if (typeof i18NextInstance.addResourceBundle === 'function') {
    i18NextInstance.addResourceBundle(lang, namespace, translations, deep, overwrite);
  } else if (i18NextInstance && i18NextInstance.services && i18NextInstance.services.resourceStore) {
    const store = i18NextInstance.services.resourceStore.data;
    store[lang] = store[lang] || {};
    if (overwrite || !store[lang][namespace]) {
      store[lang][namespace] = translations;
    }
    // Attempt to inform i18next that resources have been reloaded
    if (typeof i18NextInstance.reloadResources === 'function') {
      try {
        i18NextInstance.reloadResources([lang], [namespace]);
      } catch {
        // ignore — best-effort
      }
    }
  } else {
    // As last resort, attach into a minimal resourceStore property expected elsewhere
    i18NextInstance.services = i18NextInstance.services || {};
    /* eslint-disable id-blacklist */
    i18NextInstance.services.resourceStore = i18NextInstance.services.resourceStore || { data: {} };
    i18NextInstance.services.resourceStore.data[lang] = i18NextInstance.services.resourceStore.data[lang] || {};
    i18NextInstance.services.resourceStore.data[lang][namespace] = translations;
  }
};

const configurei18n = (opts = {}) => {
  if (opts.filters) {
    i18NextInstance.translator.interpolator.format = (value, format) => {
      /* eslint-disable no-prototype-builtins */
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
      // Use a safe wrapper so we never call `.bind` on an undefined value.
      t: (...args) => {
        const fn = i18NextInstance && i18NextInstance.t;
        if (typeof fn === 'function') return fn.apply(i18NextInstance, args);
        // Fallback: return the key or first argument for simple rendering in tests/dev
        return args[0];
      },
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
    req.i18Next.changeLanguage(sanitizeLanguage(req.query.lng));
  } else if (defined(req.cookies) && defined(req.cookies.i18n)) {
    req.i18Next.changeLanguage(sanitizeLanguage(req.cookies.i18n));
  } else {
    req.i18Next.changeLanguage(DEFAULT_LANG);
  }

  // Keep the global i18next module in sync so consumers that use
  // `require('i18next').language` (many step modules do) will see the same
  // normalized language value as the vendored instance.
  try {
    const globalI18next = require('i18next');

    if (typeof req.i18Next.language === 'string') {
      // Preserve the primary subtag only and sanitize against allowed languages
      globalI18next.language = sanitizeLanguage(req.i18Next.language);
    } else if (typeof req.i18Next._language === 'string') {
      globalI18next.language = sanitizeLanguage(req.i18Next._language);
    }
  } catch {
    // ignore if global i18next isn't resolvable
  }

  res.cookie(
    'i18n',
    sanitizeLanguage(req.i18Next.language),
    {
      secure: !isDev,
      httpOnly: !isDev
    }
  );

  next();
};

// After init, ensure any i18next-provided language is normalised and sanitized.
if (typeof i18NextInstance.language === 'string') {
  i18NextInstance.language = sanitizeLanguage(i18NextInstance.language);
}

module.exports = { i18NextInstance, i18nMiddleware, configurei18n };
