/* eslint-disable no-process-env, func-names */

const event = require('codeceptjs').event;
const container = require('codeceptjs').container;
const exec = require('child_process').exec;
const config = require('config');
const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('SauceLabsReportingHelper.js');
const sauceUsername = process.env.SAUCE_USERNAME || config.get('saucelabs.username');
const sauceKey = process.env.SAUCE_ACCESS_KEY || config.get('saucelabs.key');


function updateSauceLabsResult(result, sessionId) {
  const sauceUrl = `https://saucelabs.com/rest/v1/${sauceUsername}/jobs/${sessionId}`;
  const sauceCredentials = `-u ${sauceUsername}:${sauceKey}`;
  return `curl -X PUT -s -d '{"passed": ${result}}' ${sauceCredentials} ${sauceUrl}`;
}

function logSauceOnDemandSessionID(sessionId, jobName) {
  // For publishing SauceLabs results through Jenkins Sauce OnDemand plugin:
  logger.info(`SauceOnDemandSessionID=${sessionId} job-name=${jobName}`);
}

module.exports = function() {
  // Setting test success on SauceLabs
  event.dispatcher.on(event.test.passed, () => {
    const sessionId = container.helpers('WebDriverIO').browser.requestHandler.sessionID;
    const jobName = container.helpers('WebDriverIO').config.desiredCapabilities.name;
    exec(updateSauceLabsResult('true', sessionId));
    logSauceOnDemandSessionID(sessionId, jobName);
  });

  // Setting test failure on SauceLabs
  event.dispatcher.on(event.test.failed, test => {
    const sessionId = container.helpers('WebDriverIO').browser.requestHandler.sessionID;
    const jobName = container.helpers('WebDriverIO').config.desiredCapabilities.name;
    exec(updateSauceLabsResult('false', sessionId));
    if (test._retries === test.retryNum) {
      logSauceOnDemandSessionID(sessionId, jobName);
    }
  });
};