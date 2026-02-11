class Conditional {
  constructor(redirector, condition) {
    this.redirector = redirector;
    this.condition = condition;
  }

  redirect(req, res) {
    if (this.check()) {
      this.redirector.redirect(req, res);
    }
  }

  check() {
    if (typeof this.condition === 'function') {
      return this.condition();
    }
    return Boolean(this.condition);
  }

  get step() {
    return this.redirector.step;
  }
}

module.exports = Conditional;
