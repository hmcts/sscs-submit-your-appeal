const S2SService = require('./s2sService');
const config = require('config');

const s2s = new S2SService({ config });

module.exports = s2s;
