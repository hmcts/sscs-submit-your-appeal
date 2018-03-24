const waitForTimeout = parseInt(process.env.E2E_WAIT_FOR_TIMEOUT_VALUE) || 1000;
const waitForAction  = parseInt(process.env.E2E_WAIT_FOR_ACTION_VALUE)  || 500;
exports.config = {
    'tests': './**/*.test.js',
    'output': './output',
    'timeout': 1000,
    'helpers': {
        'Nightmare': {
            'url': process.env.E2E_FRONTEND_URL || 'http://localhost:3000',
            'waitForTimeout': waitForTimeout,
            'waitForAction': waitForAction,
            'show': false,
            'windowSize': ' 800x1000',
            'switches': {
                'ignore-certificate-errors': true
            }
        }
    },
    'include': {
        'I': './page-objects/steps.js'
    },
    'bootstrap': false,
    'mocha': {
        'reporterOptions': {
            'reportDir': process.env.E2E_OUTPUT_DIR || './output',
            'reportName' : 'index',
            'inlineAssets': true
        }
    },
    'name': 'Submit Your Appeal Tests'
};
