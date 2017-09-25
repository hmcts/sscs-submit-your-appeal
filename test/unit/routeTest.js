const TestServer = require('test/TestServer');

describe('routeTest.js', () => {

    let server, agent;

    before((done) => {
        const testServer = new TestServer();
        testServer.connect().then((result) => {
            server = result.server;
            agent = result.agent;
            done();
        });
    });

    after(() => {
        server.close();
    });

    describe('making application route requests which result in a HTTP 404', () => {

        it('should respond to / route with a HTTP 200:OK', function (done) {
            agent.get('/').expect(404, done);
        });

        it('should respond to /nonExistentURL route with a HTTP 404:OK', function (done) {
            agent.get('/nonExistentURL').expect(404, done);
        });

    });

});
