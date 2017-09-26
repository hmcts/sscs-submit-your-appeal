const CONF = require('config');
const {forEach} = require('lodash');
const {expect} = require('test/chai-sinon');
const walkMap = require('lib/opp/utils/treeWalker');

const Interpolator = require('node_modules/i18next/dist/commonjs/Interpolator').default;

const interpolator = new Interpolator();

const createSession = (agent) => {
    return agent.post('/session')
        .send({expires: Date.now() + 10000})
        .expect(200);
};

const getSession = (agent) => {
    return agent.get('/session')
        .expect(200);
};

const postToUrl = (agent, url, data) => {
    return agent.post(url)
        .type('form')
        .send(data);
};

const getUrl = (agent, url) => {
    return agent.get(url)
        .expect('Content-type', /html/);
};

exports.postData = (agent, url, data) => {
    const postForm = () => postToUrl(agent, url, data).expect(302);
    const returnUrl = (res) => res.headers.location;

    return createSession(agent)
        .then(postForm)
        .then(returnUrl);
};

exports.getSession = (agent) => {
    return getSession(agent)
        .then(res => res.body);
};

exports.testContent = (done, agent, underTest, content, session = {}, excludeKeys = [], dataContent = {}) => {
    const getPage = () => getUrl(agent, underTest.url);
    const checkContent = (res) => {
        const pageContent = Object.assign({}, session, CONF.commonProps, dataContent);
        const text = res.text.toLowerCase();

        walkMap(content.resources.en.translation.content, (path, content) => {
            if (!excludeKeys.includes(path)) {
                content = interpolator.interpolate(content, pageContent).toLowerCase();
                expect(text).to.contain(content);
            }
        });
    };

    return createSession(agent)
        .then(getPage)
        .then(checkContent)
        .then(done, done);
};


exports.testErrors = (done, agent, underTest, data, content, type, onlyKeys = [], session = {}) => {
    const triggerErrors = () => {
        return postToUrl(agent, underTest.url, data).expect('Content-type', /html/);
    };

    const checkErrors = (res) => {
        const pageContent = Object.assign({}, data, session, CONF.commonProps);

        forEach(content.resources.en.translation.errors, (v, k) => {
            if (!v[type]) {
                return;
            }
            v = interpolator.interpolate(v[type], pageContent);

            if (onlyKeys.length === 0) {
                expect(res.text).to.contain(v);
            } else if (onlyKeys.includes(k)) {
                expect(res.text).to.contain(v);
            }
        });
    };

    return createSession(agent)
        .then(triggerErrors)
        .then(checkErrors)
        .then(done, done);
};

exports.testRedirect = (done, agent, underTest, data, redirect) => {
    const checkRedirect = () => {
        return postToUrl(agent, underTest.url, data)
            .expect(302)
            .expect('location', redirect.url);
    };

    return createSession(agent)
        .then(checkRedirect)
        .then(() => done(), done);
};

exports.testExistence = (done, agent, underTest, text, data) => {
    const getPage = () => getUrl(agent, underTest.url);
    const checkExists = (res) => {
        if (data) {
            text = interpolator.interpolate(text, data);
        }

        expect(res.text).to.contain(text);
    };

    return createSession(agent)
        .then(getPage)
        .then(checkExists)
        .then(done, done);
};

exports.testNonExistence = (done, agent, underTest, text, data) => {
    const getPage = () => getUrl(agent, underTest.url);
    const checkNotExists = (res) => {
        if (data) {
            text = interpolator.interpolate(text, data);
        }

        expect(res.text).not.to.contain(text);
    };

    return createSession(agent)
        .then(getPage)
        .then(checkNotExists)
        .then(done, done);
};