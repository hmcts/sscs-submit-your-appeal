class CheckCookies {
  init() {
    this.cookieBannerElement = document.getElementById('app-cookie-banner');
    this.isCookiePrivacyMessageDisplayed();
  }

  isCookiePrivacyMessageDisplayed() {
    const isSessionSeenCookieExist = document.cookie.indexOf('seen_cookie_message=1') > -1;
    // If Cookie Message is not shown in the past.
    // Add a seen_cookie_message  cookie to user's browser for one year.
    if (isSessionSeenCookieExist) {
      this.toggleBanner(false);
    } else {
      const currentDate = new Date();
      const expiryDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      document.cookie = `seen_cookie_message=1; expires=${expiryDate}; path=/`;
      this.toggleBanner(true);
    }
  }

  toggleBanner(showCookieBanner) {
    if (this.cookieBannerElement) {
      if (showCookieBanner) {
        this.cookieBannerElement.style.display = 'block';
      } else {
        this.cookieBannerElement.style.display = 'none';
      }
    }
  }
}
export default CheckCookies;
