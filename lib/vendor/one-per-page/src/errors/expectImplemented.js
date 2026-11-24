class NotImplemented extends Error {
  constructor(obj, unimplemented) {
    super();
    const thing = obj.constructor.name;
    const missingMethods = unimplemented.join(', ');

    this.name = 'NotImplemented';
    this.message = `${thing} must implement ${missingMethods}`;
    this.unimplemented = unimplemented;
  }
}

const expectImplemented = (obj, ...keys) => {
  const unimplemented = keys.reduce((arr, key) => {
    if (key in obj) {
      return arr;
    }
    return [...arr, key];
  }, []);

  if (unimplemented.length) {
    throw new NotImplemented(obj, unimplemented);
  }
};

module.exports = {
  expectImplemented,
  NotImplemented
};
