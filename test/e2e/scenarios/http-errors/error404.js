//const content = require('app/steps/errors/error-404/content.json').resources.en.translation.content;
//
//Feature('HTTP 404');
//
//Scenario('Calls to application route should error with a 404', (I) => {
//
//    I.amOnPage('/');
//    I.see(content.title);
//
//});
//
//Scenario('Unknown URLs show error with a 404', (I) => {
//
//    I.amOnPage('/unknownURL');
//    I.see(content.title);
//
//});