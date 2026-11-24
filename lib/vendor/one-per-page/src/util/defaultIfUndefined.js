const defaultIfUndefined = (property, defaultValue) => {
  if (typeof property === 'undefined') {
    return defaultValue;
  }
  return property;
};

module.exports = defaultIfUndefined;
