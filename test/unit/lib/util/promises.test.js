const { expect } = require('test/util/chai');
const { fallback, Defer, timeout } = require('lib/vendor/one-per-page/src/util/promises');

describe('util/promises', () => {
  describe('Defer', () => {
    describe('#promise', () => {
      it('returns a promise', () => {
        const defer = new Defer();
        expect(defer.promise).to.be.an.instanceof(Promise);
      });
    });

    describe('#reject', () => {
      it('rejects the promise', () => {
        let pending = true;
        const defer = new Defer();
        defer.promise.then(() => {
          pending = false;
        },
        () => {
          pending = false;
        });
        return Promise.all([
          () => expect(pending).to.be.true,
          defer.reject(),
          expect(defer.promise).to.eventually.be.rejected,
          () => expect(pending).to.be.false
        ]);
      });
    });

    describe('#resolve', () => {
      it('resolves the promise', () => {
        let pending = true;
        const defer = new Defer();
        defer.promise.then(() => {
          pending = false;
        },
        () => {
          pending = false;
        });
        return Promise.all([
          () => expect(pending).to.be.true,
          defer.resolve(),
          expect(defer.promise).to.eventually.be.fulfilled,
          () => expect(pending).to.be.false
        ]);
      });
    });
  });

  describe('fallback', () => {
    it('resolves the first resolved promise', () => {
      const result = fallback([Promise.resolve('Foo')]);
      return expect(result).to.eventually.eql('Foo');
    });

    it('falls back if first promise fails', () => {
      const result = fallback([
        Promise.reject(new Error('fail')),
        Promise.resolve('Foo')
      ]);
      return expect(result).to.eventually.eql('Foo');
    });

    it('waits for promises higher in the chain', () => {
      let pending = true;
      const deferred = new Defer();
      const result = fallback([
        deferred.promise,
        Promise.resolve('Foo'),
        Promise.reject(new Error('fail'))
      ]);
      result.then(() => {
        pending = false;
      });

      expect(pending).to.be.true;
      deferred.reject();
      return Promise.all([
        expect(result).to.become('Foo'),
        () => expect(pending).to.be.false
      ]);
    });

    it('rejects if all promises reject', () => {
      const result = fallback([Promise.reject(new Error('fail'))]);
      return expect(result).to.eventually.rejectedWith('All promises rejected');
    });
  });

  describe('#timeout', () => {
    it('rejects if the given promise doesn\'t resolve in time', () => {
      const result = timeout(10, new Promise(() => {
        /* intentionally blank */
      }));
      return expect(result).rejectedWith('Timed out in 10 ms.');
    });

    it('rejects if the promise rejects in time', () => {
      const result = timeout(10, new Promise((resolve, reject) =>
        reject(new Error('Failed'))
      ));
      return expect(result).rejectedWith('Failed');
    });

    it('resolves if the promise resolves in time', () => {
      const result = timeout(10, new Promise(resolve => resolve('Done')));
      return expect(result).eventually.eql('Done');
    });
  });
});
