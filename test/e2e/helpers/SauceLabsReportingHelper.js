/* eslint-disable no-process-env, func-names */

const event = require('codeceptjs').event;
const container = require('codeceptjs').container;
const exec = require('child_process').exec;
const config = require('config');
const logger = require('logger');

const logPath = 'SauceLabs.ReportigHelper.js';


const sauceUsername = process.env.SAUCE_USERNAME || config.get('saucelabs.username');
const sauceKey = process.env.SAUCE_ACCESS_KEY || config.get('saucelabs.key');


function updateSauceLabsResult(result, sessionId) {
  const sauceUrl = ` https://eu-central-1.saucelabs.com/rest/v1/${sauceUsername}/jobs/${sessionId}`;
  const sauceCredentials = `-u ${sauceUsername}:${sauceKey}`;
  // For publishing SauceLabs results through Jenkins Sauce OnDemand plugin:
  logger.trace(`SauceOnDemandSessionID=${sessionId} job-name=sscs-submit-your-appeal`, logPath);
  return `curl -X PUT -s -d '{"passed": ${result}}' ${sauceCredentials} ${sauceUrl}`;
}

module.exports = function() {
  // Setting test success on SauceLabs
  event.dispatcher.on(event.test.passed, () => {
    const sessionId = container.helpers('WebDriver').browser.sessionId;
    exec(updateSauceLabsResult('true', sessionId));
  });

  // Setting test failure on SauceLabs
  event.dispatcher.on(event.test.failed, () => {
    const sessionId = container.helpers('WebDriver').browser.sessionId;
    exec(updateSauceLabsResult('false', sessionId));
  });
};