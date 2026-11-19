const isTest = ['test', 'testing'].includes(process.env.NODE_ENV);
const isDev = ['development', 'dev'].includes(process.env.NODE_ENV);

module.exports = { isTest, isDev };
