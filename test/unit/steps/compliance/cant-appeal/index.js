const TestServer = require('test/TestServer');
const {testContent} = require('test/util/assertions');
const modulePath = 'steps/compliance/cant-appeal';
const content = require(`${modulePath}/content`);

describe(modulePath, () => {

    let server, underTest, agent;

    beforeEach((done) => {
        const testServer = new TestServer();
        testServer.connect().then((result) => {
            server = result.server;
            underTest = result.steps.CantAppeal;
            agent = result.agent;
            done();
        });
    });

    afterEach(() => {
        server.close();
    });

    describe('success', () => {

        it('renders the content from the content file', (done) => {
            testContent(done, agent, underTest, content);
        });

    });
});