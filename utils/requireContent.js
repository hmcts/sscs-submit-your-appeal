// Utility to require localized content files with safe fallbacks.
// Usage: const requireContent = require('utils/requireContent');
// const content = requireContent.requireLocalized('steps/start/benefit-type/content', sessionLanguage);

const path = require('path');

const DEFAULT_LANG = 'en';

function tryRequire(modulePath) {
  try {
    return require(modulePath);
  } catch (error) {
    // Only swallow MODULE_NOT_FOUND to try alternatives — rethrow other errors.
    if (error && error.code === 'MODULE_NOT_FOUND') {
      return null;
    }
    throw error;
  }
}

function getCallerDir() {
  // Capture stack and find the first file path outside this module
  const orig = Error.prepareStackTrace;
  try {
    const error = new Error();
    Error.prepareStackTrace = (errObj, stackTraces) => stackTraces;
    const stack = error.stack;
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
  } catch {
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

  const error = new Error(
    `Could not load content for ${basePath}. Tried: ${tried.join(', ')}`
  );
  error.code = 'CONTENT_NOT_FOUND';
  throw error;
}

module.exports = { requireLocalized };
