const logger = require('logger');
const request = require('superagent');
const config = require('config');

const testDataEn = require('test/e2e/data.en');
const crypto = require('crypto');

const sidamApiUrl = config.get('services.idam-aat.apiUrl');
const timeout = config.get('services.idam-aat.apiCallTimeout');

const createUser = async () => {
  console.log('Creating Idam test user');
  const password = testDataEn.signIn.password;
  const buf = crypto.randomBytes(1);
  const email = `test${buf[0]}@hmcts.net`;

  try {
    await request
      .post(`${sidamApiUrl}/testing-support/accounts`)
      .send({
        email,
        forename: 'ATestForename',
        password,
        surname: 'ATestSurname',
        roles: [
          {
            code: 'citizen'
          }
        ]
      })
      .timeout(timeout)
      .trustLocalhost();

    console.log(`Created idam user for ${email} with password ${password}`);
    return email;
  } catch (error) {
    logger.error('Error createUser', error.message);
  }
};

const deleteUser = async email => {
  try {
    await request
      .delete(`${sidamApiUrl}/testing-support/accounts/${email}`)
      .timeout(timeout)
      .trustLocalhost();

    console.log(`Deleted SIDAM user for ${email}`);
  } catch (error) {
    logger.error('Error deleteUser', error.message);
  }
};

module.exports = { createUser, deleteUser };