/* eslint-disable no-magic-numbers */
const logger = require('logger');
const rp = require('@cypress/request-promise');
const config = require('config');

const testDataEn = require('test/e2e/data.en');
const crypto = require('crypto');

const sidamApiUrl = config.get('services.idam-aat.apiUrl');
const timeout = config.get('services.idam-aat.apiCallTimeout');


const createUser = () => {
  console.log('Creating Idam test user');
  const password = testDataEn.signIn.password;
  const buf = crypto.randomBytes(1);
  const email = `test${buf[0]}@hmcts.net`;
  const options = {
    url: `${sidamApiUrl}/testing-support/accounts`,
    json: true,
    body: {
      email,
      forename: 'ATestForename',
      password,
      surname: 'ATestSurname',
      roles: [
        {
          code: 'citizen'
        }
      ]
    },
    insecure: true,
    timeout
  };

  try {
    rp.post(options);
    console.log(`Created idam user for ${email} with password ${password}`);
    return email;
  } catch (error) {
    return logger.error('Error createUser', error.message);
  }
};

const deleteUser = email => {
  const options = {
    url: `${sidamApiUrl}/testing-support/accounts/${email}`,
    insecure: true,
    timeout
  };

  try {
    rp.delete(options);
  } catch (error) {
    logger.error('Error deleteUser', error);
  }

  console.log(`Deleted SIDAM user for ${email}`);
};


module.exports = { createUser, deleteUser };
