require('module-alias/register');
const customJoi = require('../utils/customJoiSchemas');

const schema = customJoi.string().validatePhone();
const resWrapper = customJoi.validate('+447512345678', schema);
const resSchema = schema.validate('+447512345678');
console.log('customJoi.validate =>', JSON.stringify(resWrapper));
console.log('schema.validate =>', JSON.stringify(resSchema));
console.log('typeof customJoi.validate ===', typeof customJoi.validate);
console.log('keys of schema:', Object.keys(schema));
console.log('schema.validate is function?', typeof schema.validate === 'function');
