const { expect } = require('test/util/chai');
const { requireLocalized } = require('utils/requireContent');

describe('utils/requireContent', () => {
  it('loads valid english content when en is specified', () => {
    const content = requireLocalized('steps/start/benefit-type/content', 'en');
    expect(content).to.be.an('object');
    expect(content).to.have.property('title');
  });

  it('loads valid english content when language includes region subtag', () => {
    const content = requireLocalized('steps/start/benefit-type/content', 'en-GB');
    expect(content).to.be.an('object');
    expect(content).to.have.property('title');
  });

  it('safely falls back to default english when given a path traversal string', () => {
    const content = requireLocalized('steps/start/benefit-type/content', '../../../../package.json');
    expect(content).to.be.an('object');
    expect(content).to.have.property('title');
  });

  it('safely falls back to default english when given an unsupported language', () => {
    const content = requireLocalized('steps/start/benefit-type/content', 'fr');
    expect(content).to.be.an('object');
    expect(content).to.have.property('title');
  });

  it('throws CONTENT_NOT_FOUND when base path cannot be resolved', () => {
    expect(() => {
      requireLocalized('steps/nonexistent/step/content', 'en');
    }).to.throw(/Could not load content/);
  });
});
