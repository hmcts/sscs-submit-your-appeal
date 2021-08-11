const supportedBrowsers = {
  microsoft: {
  //   // ie11_win10: {
  //   //   browserName: 'internet explorer',
  //   //   name: 'IE11_Win10',
  //   //   platform: 'Windows 10',
  //   //   ignoreZoomSetting: true,
  //   //   nativeEvents: false,
  //   //   ignoreProtectedModeSettings: true,
  //   //   version: '11'
  //   // },


    edge_win10: {
      browserName: 'MicrosoftEdge',
      platformName: 'Windows 10',
      ignoreZoomSetting: true,
      nativeEvents: false,
      ignoreProtectedModeSettings: true,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Edge_Win10_LATEST_SSCS'
      }
    }
  },
  chrome: {
    chrome_win_latest: {
      browserName: 'chrome',
      platformName: 'Windows 10',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'WIN_CHROME_LATEST_SSCS'
      }
    },
    chrome_mac_latest: {
      browserName: 'chrome',
      platformName: 'macOS 10.15',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'MAC_CHROME_LATEST_SSCS'
      }
    }
  },
  firefox: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: 'Windows 10',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'WIN_FIREFOX_LATEST_SSCS'
      }
    },
    firefox_mac_latest: {
      browserName: 'firefox',
      platformName: 'macOS 10.15',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'MAC_FIREFOX_LATEST_SSCS'
      }
    }
  },
  // safari: {
  //   safari_mac_latest: {
  //     browserName: 'safari',
  //     platformName: 'macOS 11.00',
  //     browserVersion: 'latest',
  //     'sauce:options': {
  //       name: 'MAC_SAFARI_LATEST_SSCS',
  //       seleniumVersion: '3.141.59'
  //     }
  //   }
  // }
};

module.exports = supportedBrowsers;