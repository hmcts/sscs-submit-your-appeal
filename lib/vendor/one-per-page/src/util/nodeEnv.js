const config = require('config');

const isTest = config.NODE_ENV === 'testing';
const isDev = config.NODE_ENV === 'development';

module.exports = { isTest, isDev };
