const waitForTimeout = parseInt(process.env.E2E_WAIT_FOR_TIMEOUT_VALUE) || 10000;
const waitForAction = parseInt(process.env.E2E_WAIT_FOR_ACTION_VALUE) || 2000;
exports.config = {
    'tests': './**/*.test.js',
    'output': './output',
    'timeout': 1000,
    'helpers': {
        'Nightmare': {
            'url': process.env.E2E_FRONTEND_URL || 'http://localhost:3000',
            'waitForTimeout': waitForTimeout,
            'typeInterval': 20,
            'waitForAction': waitForAction,
            'show': false,
            'windowSize': ' 800x1000'
        },
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
