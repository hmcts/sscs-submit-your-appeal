// Utility to require localized content files with safe fallbacks.
// Usage: const requireContent = require('utils/requireContent');
// const content = requireContent.requireLocalized('steps/start/benefit-type/content', sessionLanguage);

const path = require('path');

const DEFAULT_LANG = 'en';

function tryRequire(modulePath) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(modulePath);
  } catch (err) {
    // Only swallow MODULE_NOT_FOUND to try alternatives — rethrow other errors.
    if (err && err.code === 'MODULE_NOT_FOUND') {
      return null;
    }
    throw err;
  }
}

function getCallerDir() {
  // Capture stack and find the first file path outside this module
  const orig = Error.prepareStackTrace;
  try {
    const err = new Error();
    Error.prepareStackTrace = (errObj, stackTraces) => stackTraces;
    const stack = err.stack;
    Error.prepareStackTrace = orig;
    for (let i = 0; i < stack.length; i++) {
      const fileName = stack[i].getFileName && stack[i].getFileName();
      if (
        fileName &&
        !fileName.includes(path.join('utils', 'requireContent.js'))
      ) {
        return path.dirname(fileName);
      }
    }
  } catch (e) {
    // fall through
  } finally {
    Error.prepareStackTrace = orig;
  }
  return process.cwd();
}

function resolveIfRelative(p, callerDir) {
  if (!p) return p;
  // treat paths starting with './' or '../' as relative to caller
  if (p.startsWith('./') || p.startsWith('../')) {
    return path.join(callerDir, p);
  }
  return p;
}

function requireLocalized(basePath, lang) {
  const callerDir = getCallerDir();
  const tried = [];
  if (lang) {
    tried.push(`${basePath}.${lang}`);
  }
  if (lang && lang.includes('-')) {
    tried.push(`${basePath}.${lang.split('-')[0]}`);
  }
  tried.push(`${basePath}.${DEFAULT_LANG}`);

  for (const p of tried) {
    const candidate = resolveIfRelative(p, callerDir);
    const mod = tryRequire(candidate);
    if (mod) return mod;
  }

  // As a last resort try the basePath without suffix (some files export content.json directly)
  const baseResolved = resolveIfRelative(basePath, callerDir);
  const mod = tryRequire(baseResolved);
  if (mod) return mod;

  const err = new Error(
    `Could not load content for ${basePath}. Tried: ${tried.join(', ')}`
  );
  err.code = 'CONTENT_NOT_FOUND';
  throw err;
}

module.exports = { requireLocalized };
