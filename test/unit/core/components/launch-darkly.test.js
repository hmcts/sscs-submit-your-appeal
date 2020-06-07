'use strict';

const expect = require('chai').expect;
const LaunchDarkly = require('core/components/launch-darkly');

describe('LaunchDarkly', () => {
  let ld = null;

  it('should create a new launchdarkly instance', done => {
    ld = new LaunchDarkly({ offline: true }, true).getInstance();

    // eslint-disable-next-line no-unused-expressions
    expect(ld.client).to.not.be.undefined;
    ld.close();
    done();
  });

  it('should successfully close the LD connection and clear the instance', done => {
    ld = new LaunchDarkly({ offline: true });
    let instance = ld.getInstance();

    // eslint-disable-next-line no-unused-expressions
    expect(instance).to.not.be.undefined;

    ld.close();
    instance = ld.getInstance();

    expect(instance).to.be.undefined;
    done();
  });
});
