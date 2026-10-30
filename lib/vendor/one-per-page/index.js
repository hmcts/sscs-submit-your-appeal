// Re-export of upstream source files we've vendored into lib/vendor/one-per-page/src
module.exports = Object.assign(
  {},
  require('./src/flow/index.js'),
  require('./src/forms/index.js'),
  require('./src/steps/index.js'),
  require('./src/session/index.js'),
  require('./src/i18n/i18Next.js')
);
