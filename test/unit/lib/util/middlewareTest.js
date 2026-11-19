class MiddlewareTest {
  constructor(req, res) {
    this.middleware = [];
    this.req = req;
    this.res = res;
  }

  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }

  run() {
    return this.middleware.reduce((promise, middleware) => {
      return promise.then(() => new Promise((resolve, reject) => {
        const next = error => {
          if (error) {
            reject(error);
          } else {
            resolve(this.req, this.res);
          }
        };

        middleware(this.req, this.res, next);
      }));
    }, Promise.resolve());
  }
}
const middlewareTest = (req = {}, res = {}) => new MiddlewareTest(req, res);

module.exports = { middlewareTest };
