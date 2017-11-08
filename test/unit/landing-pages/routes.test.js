const HttpStatus = require('http-status-codes');
const testServer = require('test/testServer');
const paths = require('paths');
const request = require('supertest');

describe('routes.js', () => {

    let httpServer;

    before(done => {
        testServer.connect()
            .then(server => {
                httpServer = server;
                done();
            })
    });

    after(() => {
        httpServer.close();
    });

    describe('making application route requests which result in a HTTP 200', () => {

        it('should respond to /overview', done => {
            request(httpServer)
                .get(paths.landingPages.overview)
                .expect(HttpStatus.OK, done);
        });

        it('should respond to /before-you-appeal', done => {
            request(httpServer)
                .get(paths.landingPages.beforeYouAppeal)
                .expect(HttpStatus.OK, done);
        });

        it('should respond to /help-with-appeal', done => {
            request(httpServer)
                .get(paths.landingPages.helpWithAppeal)
                .expect(HttpStatus.OK, done);
        });

        it('should respond to /start-an-appeal', done => {
            request(httpServer)
                .get(paths.landingPages.startAnAppeal)
                .expect(HttpStatus.OK, done);
        });

        it('should respond to /after-you-appeal', done => {
            request(httpServer)
                .get(paths.landingPages.afterYouAppeal)
                .expect(HttpStatus.OK, done);
        });

    });

});
