class Defer {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

const fallback = promises => {
  const deferred = new Defer();
  let rejected = 0;
  const handleRejection = next => () => {
    rejected += 1;
    if (rejected === promises.length) {
      deferred.reject(new Error('All promises rejected'));
    }
    return next;
  };
  const chainPromises = (chain, head) => head.catch(handleRejection(chain));
  const terminal = undefined; // eslint-disable-line no-undefined

  promises
    .reverse()
    .reduce(chainPromises, terminal)
    .then(deferred.resolve);

  return deferred.promise;
};

const timeout = (ms, promise) => {
  const timeoutPromise = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Timed out in ${ms} ms.`));
    }, ms);
  });

  return Promise.race([
    promise,
    timeoutPromise
  ]);
};

module.exports = { fallback, Defer, timeout };
