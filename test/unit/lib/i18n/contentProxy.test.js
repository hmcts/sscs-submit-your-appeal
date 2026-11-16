const util = require('util');
const { expect, sinon } = require('test/util/chai');
const { contentProxy } = require('lib/vendor/one-per-page/src/i18n/contentProxy');

describe('i18n/contentProxy', () => {
  describe('contentProxy', () => {
    it('exposes an es6 proxy handler', () => {
      const fakeStep = { name: 'FakeStep' };
      const handler = contentProxy(fakeStep);
      expect(handler).to.be.an('object');
      expect(handler).to.have.property('get').that.is.a('function');
    });

    const t = sinon.stub();
    const exists = sinon.stub();
    const getResourceBundle = sinon.stub().returns({ key: 'key' });
    const fakeStep = { name: 'FakeStep' };
    const proxy = new Proxy({
      t,
      exists,
      getResourceBundle,
      language: 'en'
    }, contentProxy(fakeStep));

    beforeEach(() => {
      t.reset();
      exists.reset();
    });

    it('proxies proxy.[key] to a new proxy', () => {
      exists.withArgs('FakeStep:key').returns(true);
      t.withArgs('FakeStep:key').returns('Content');
      const key = proxy.key;
      expect(key.inspect()).to.match(/Proxy/);
    });

    describe('#toString', () => {
      it('returns i18n.t("[key]") if key exists', () => {
        exists.withArgs('FakeStep:key').returns(true);
        t.withArgs('FakeStep:key').returns('Content');
        const key = proxy.key;
        expect(key.toString()).to.eql('Content');
      });

      it('returns i18n.t("[key]") if key exists (Symbol)', () => {
        exists.withArgs('FakeStep:key').returns(true);
        t.withArgs('FakeStep:key').returns('Content');
        const key = proxy.key;
        expect(key[Symbol.toStringTag]()).to.eql('Content');
      });

      it('throws if key doesn\'t exist', () => {
        exists.withArgs('FakeStep:key').returns(false);
        const key = proxy.key;
        expect(() => key.toString())
          .to.throw(/No translation for FakeStep:key/);
      });

      it('proxies nested keys i18n.t("key.key")', () => {
        exists.withArgs('FakeStep:foo.bar').returns(true);
        t.withArgs('FakeStep:foo.bar').returns('Content');

        expect(proxy.foo.bar.toString()).to.eql('Content');
      });
    });

    describe('#inspect', () => {
      const key = 'FakeStep:foo';
      const msg = 'Foo is fine';
      const description = `Proxy { key: ${key}, value: ${msg} }`;

      beforeEach(() => {
        t.withArgs(key).returns(msg);
      });

      it('returns a description of the proxy', () => {
        expect(proxy.foo.inspect()).to.eql(description);
      });
      it('returns a description of the proxy (Symbol)', () => {
        expect(proxy.foo[util.inspect.custom]()).to.eql(description);
      });
    });

    describe('#hasOwnProperty (used by nunjucks)', () => {
      it('returns true for #toString (string)', () => {
        // eslint-disable-next-line no-prototype-builtins
        expect(proxy.foo.hasOwnProperty('toString')).to.be.true;
      });
      it('returns true for #toString (symbol)', () => {
        // eslint-disable-next-line no-prototype-builtins
        expect(proxy.foo.hasOwnProperty(Symbol.toStringTag)).to.be.true;
      });
      it('returns true for #inspect (string)', () => {
        // eslint-disable-next-line no-prototype-builtins
        expect(proxy.foo.hasOwnProperty('inspect')).to.be.true;
      });
      it('returns true for #inspect (symbol)', () => {
        // eslint-disable-next-line no-prototype-builtins
        expect(proxy.foo.hasOwnProperty(util.inspect.custom)).to.be.true;
      });

      it('returns false for #__keywords', () => {
        // used by nunjucks to determine if the last argument in a macro
        // is a dict of keyword args
        // eslint-disable-next-line no-prototype-builtins
        expect(proxy.foo.hasOwnProperty('__keywords')).to.be.false;
      });
    });

    describe('#keys (used by one-per-page-test-suite)', () => {
      it('returns all keys for properties', () => {
        expect(proxy.foo.keys).to.eql({ key: 'key' });
      });
    });
  });
});
