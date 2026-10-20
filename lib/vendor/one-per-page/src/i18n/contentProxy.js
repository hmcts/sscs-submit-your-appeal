const util = require('util');
const { notDefined } = require('../util/checks');

const prefixKey = (prefix, key) => {
  if (notDefined(prefix) || prefix === '') {
    return key;
  }
  return `${prefix}.${key}`;
};

const toStringKeys = ['toString', Symbol.toStringTag];
const inspectKeys = ['inspect', util.inspect.custom];
const toJsonKeys = ['toJSON'];
const observersKeys = ['observers'];

const contentProxy = (step, prefix) => {
  const get = (target, name) => {
    if (name === 'hasOwnProperty') {
      return property => {
        const isToString = toStringKeys.includes(property);
        const isInspect = inspectKeys.includes(property);
        return isToString || isInspect;
      };
    }
    if (name === 'keys') {
      const language = target.language || target.options.fallbackLng;
      const content = target
        .getResourceBundle(language, `${step.name}`);
      return content;
    }
    const key = `${step.name}:${prefix}`;
    if (toStringKeys.includes(name) || toJsonKeys.includes(name) || observersKeys.includes(name)) {
      if (target.exists(key)) {
        return () => target.t(key, step.locals);
      }
      return () => {
        throw new Error(`No translation for ${key}`);
      };
    }
    if (inspectKeys.includes(name)) {
      return () => `Proxy { key: ${key}, value: ${target.t(key)} }`;
    }
    const newPrefix = prefixKey(prefix, name);
    return new Proxy(target, contentProxy(step, newPrefix));
  };

  return { get };
};

module.exports = { contentProxy };
