const TestServer = require('test/TestServer');
const {testContent} = require('test/util/assertions');
const step = 'app/steps/errors/error-500';
const content = require(`${step}/content`);

describe(step, () => {

    let server, underTest, agent;

    beforeEach((done) => {
        const testServer = new TestServer();
        testServer.connect().then((result) => {
            server = result.server;
            underTest = result.steps.Error500;
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
