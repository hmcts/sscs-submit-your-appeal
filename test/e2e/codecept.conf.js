exports.config = {
    'tests': './**/*.test.js',
    'output': './output',
    'timeout': 1000,
    'helpers': {
        'Nightmare': {
            'url': process.env.E2E_FRONTEND_URL || 'http://localhost:3000',
            'waitForTimeout': 2000,
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
    'name': 'frontEnd Tests'
};
