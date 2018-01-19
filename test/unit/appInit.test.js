const {expect} = require('test/util/chai');
const testServer = require('test/testServer');

describe('Application initialisation', () => {

    let httpServer;

    before((done) => {
        testServer.connect().then((server) => {
            httpServer = server;
            done();
        })
    });

    after(() => {
        httpServer.close();
    });

    it('should define an express http.Server', () => {
        expect(httpServer.constructor.name).to.equal('Server');
    });

});
