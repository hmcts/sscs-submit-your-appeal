'use strict';

const Sessions = require('steps/session/Sessions');
const { expect, should } = require('test/util/chai');
const { stub } = require('sinon');
const urls = require('urls');

describe('Sessions.js', () => {

    const res = stub();
    const sessions = {
        session: 'sya-session'
    };
    const req = {
        sessionStore: {
            all: stub().callsArgWith(0, null, sessions)
        }
    };
    let sessionsClass;
    res.send = stub();

    beforeEach(() => {
        sessionsClass = new Sessions();
    });

    after(() => {
        sessionsClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /sessions', () => {
            expect(sessionsClass.url).to.equal(urls.session.sessions);
        });

    });

    describe('handler', () => {

        it('calls res.send()', () => {
            sessionsClass.handler(req, res);
            const sendSession = JSON.stringify(sessions, null, 2);
            res.send.should.have.been.calledWith(sendSession);
        });

    });

});
