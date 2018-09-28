/* eslint-disable no-process-env, func-names */

const event = require('codeceptjs').event;
const container = require('codeceptjs').container;
const exec = require('child_process').exec;
const config = require('config');
const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('SauceLabsReportingHelper.js');
const sauceUsername = process.env.SAUCE_USERNAME || config.get('saucelabs.username');
const sauceKey = process.env.SAUCE_ACCESS_KEY || config.get('saucelabs.key');


function updateSauceLabsResult(result, sessionId, jobName) {
  const sauceUrl = `https://saucelabs.com/rest/v1/${sauceUsername}/jobs/${sessionId}`;
  const sauceCredentials = `-u ${sauceUsername}:${sauceKey}`;
  // For publishing SauceLabs results through Jenkins Sauce OnDemand plugin:
  logger.info(`SauceOnDemandSessionID=${sessionId} job-name=${jobName}`);
  return `curl -X PUT -s -d '{"passed": ${result}}' ${sauceCredentials} ${sauceUrl}`;
}

module.exports = function() {
  // Setting test success on SauceLabs
  event.dispatcher.on(event.test.passed, () => {
    const sessionId = container.helpers('WebDriverIO').browser.requestHandler.sessionID;
    const jobName = container.helpers('WebDriverIO').config.desiredCapabilities.name;
    exec(updateSauceLabsResult('true', sessionId, jobName));
  });

  // Setting test failure on SauceLabs
  event.dispatcher.on(event.test.failed, () => {
    const sessionId = container.helpers('WebDriverIO').browser.requestHandler.sessionID;
    const jobName = container.helpers('WebDriverIO').config.desiredCapabilities.name;
    exec(updateSauceLabsResult('false', sessionId, jobName));
  });
};