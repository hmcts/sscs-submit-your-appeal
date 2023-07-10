import cookieManager from '@hmcts/cookie-manager';

cookieManager.on('UserPreferencesLoaded', preferences => {
  preferences['analytics'] = preferences['analytics'] === true ? 'on' : preferences['analytics'];
  preferences['apm'] = preferences['apm'] === true ? 'on' : preferences['apm'];
  console.debug('Received UserPreferencesLoaded, pushing cookie preferences: ' + JSON.stringify(preferences));
  const dataLayer = window.dataLayer || [];
  // dataLayer.push({ event: 'Cookie Preferences', cookiePreferences: preferences });
});

cookieManager.on('UserPreferencesSaved', preferences => {
  preferences['analytics'] = preferences['analytics'] === true ? 'on' : preferences['analytics'];
  preferences['apm'] = preferences['apm'] === true ? 'on' : preferences['apm'];
  console.debug('Received UserPreferencesSaved, Pushing cookie preferences: ' + JSON.stringify(preferences));
  const dataLayer = window.dataLayer || [];
  const dtrum = window.dtrum;

  dataLayer.push({ event: 'Cookie Preferences', cookiePreferences: preferences });

  // eslint-disable-next-line no-undefined
  if (dtrum !== undefined) {
    if (preferences.apm === 'on') {
      dtrum.enable();
      dtrum.enableSessionReplay();
    } else {
      dtrum.disableSessionReplay();
      dtrum.disable();
    }
  }
});

const config = {
  userPreferences: {
    cookieName: 'cookies_policy'
  },
  cookieManifest: [
    {
      categoryName: 'analytics',
      cookies: [
        '_ga',
        '_gid',
        '_gat_UA-'
      ]
    },
    {
      categoryName: 'apm',
      cookies: [
        'dtCookie',
        'dtLatC',
        'dtPC',
        'dtSa',
        'rxVisitor',
        'rxvt'
      ]
    }
  ]
};

cookieManager.init(config);