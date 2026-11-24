const { get, unset } = require('lodash');


const getWatches = (journey = { steps: {} }) => {
  const watches = {};

  if (journey.steps) {
    Object.keys(journey.steps).forEach(StepName => {
      const step = journey.steps[StepName];
      const stepInstance = journey.instance(step);
      if (stepInstance.watches) {
        Object.keys(stepInstance.watches).forEach(path => {
          watches[path] = watches[path] || [];
          watches[path].push(stepInstance.watches[path]);
        });
      }
    });
  }

  return watches;
};

const hasChanged = (path, previousSession, session) => {
  const previousValue = get(previousSession, path);
  const newValue = get(session, path);

  if (typeof previousValue === 'string' && typeof newValue === 'string') {
    return previousValue !== newValue;
  }
  // if variables are not strings then turn them into strings to compare
  return JSON.stringify(previousValue) !== JSON.stringify(newValue);
};

const traverseWatches = (journey, previousSession = {}, session = {}) => {
  const watches = getWatches(journey);

  const watchPaths = Object.keys(watches);

  const remove = (...pathsToRemove) => {
    pathsToRemove.forEach(path => {
      if (typeof get(session, path) === 'undefined') {
        return;
      }

      unset(session, path);

      traverseWatches(journey, previousSession, session);
    });
  };

  watchPaths.forEach(path => {
    const watchCallbacks = watches[path];
    if (hasChanged(path, previousSession, session)) {
      watchCallbacks.forEach(watchCallback => {
        const previousValue = get(previousSession, path);
        const currentValue = get(session, path);
        watchCallback(previousValue, currentValue, remove, session);
      });
    }
  });
};

module.exports = { traverseWatches };