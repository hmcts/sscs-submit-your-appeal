const paths = require('paths');

const language = 'en';
const cookieContent = require('./cookie-content');

Feature(`${language.toUpperCase()} - Cookie banner UI tests @fullFunctional`);

Before(I => {
  I.createTheSession(language);
  I.amOnPage(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - PIP verify cookies banner Element`, I => {
  I.wait(2);
  I.see(cookieContent.bannerTitle);
  I.seeElement('.govuk-cookie-banner');

  I.see(cookieContent.acceptCookie);
  I.see(cookieContent.rejectCookie);

  I.click(cookieContent.viewPolicy);
  I.see(cookieContent.policy.title);
  I.see(cookieContent.policy.selectCookieOptions);
});

Scenario(`${language.toUpperCase()} - PIP accept additional cookies`, I => {
  I.wait(2);
  I.click(cookieContent.acceptCookie);
  I.see(cookieContent.hideAfterAccept);
  I.see(cookieContent.hideMessage);
  I.refreshPage();

  I.seeCookie('_ga');
  I.seeCookie('_gid');
  I.seeCookie('_gat_UA-91309785-5');
});

Scenario(`${language.toUpperCase()} - PIP reject additional cookies`, I => {
  I.wait(2);
  I.click(cookieContent.rejectCookie);
  I.see(cookieContent.hideAfterReject);
  I.see(cookieContent.hideMessage);
  I.refreshPage();

  I.dontSeeCookie('_ga');
  I.dontSeeCookie('_gid');
});

Scenario(`${language.toUpperCase()} - PIP accept cookies using the new cookie policy page`, I => {
  I.wait(2);
  I.click(cookieContent.acceptCookie);
  I.see(cookieContent.hideAfterAccept);
  I.see(cookieContent.hideMessage);
  I.refreshPage();

  I.seeCookie('_ga');
  I.seeCookie('_gid');
  I.seeCookie('_gat_UA-91309785-5');

  I.amOnPage(paths.policy.cookies);
  I.seeElement('input#radio-analytics-on:checked');
  I.wait(2);
  I.click('input#radio-analytics-off');
  I.click('Save');

  I.amOnPage(paths.start.benefitType);
  I.dontSeeCookie('_ga');
  I.dontSeeCookie('_gid');
});
