const { defined } = require('./checks');

const andWise = (a, b) => a && b;
const orWise = (a, b) => a || b;

const flattenArray = (left, right) => [...left, ...right];
const flattenObject = (obj1, obj2) => Object.assign(obj1, obj2);

const mapEntries = (obj, block) => Object.entries(obj)
  .reduce((accum, [key, value]) => {
    const newValue = block(key, value);
    if (defined(newValue)) {
      return Object.assign(accum, { [key]: newValue });
    }
    return accum;
  }, {});

module.exports = { mapEntries, andWise, orWise, flattenArray, flattenObject };
