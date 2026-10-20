const Conditional = require('./conditional');

class Branch {
  constructor(...redirectors) {
    const branches = Array.from(redirectors);
    const last = branches.pop();
    if (branches.length === 0) {
      throw new Error('Branch needs atleast two paths');
    }
    if (!branches.every(b => b instanceof Conditional)) {
      throw new Error('All but the last path must be conditional');
    }
    if (last instanceof Conditional) {
      throw new Error('The last path must not be conditional');
    }
    this.branches = branches;
    this.fallback = last;
  }

  redirect(req, res) {
    const findBranchThatPasses = branches => {
      if (branches.length === 0) {
        return this.fallback;
      }
      const [current, ...rest] = branches;
      if (current.check()) {
        return current;
      }
      return findBranchThatPasses(rest);
    };

    findBranchThatPasses(this.branches).redirect(req, res);
  }

  get step() {
    const branch = this.branches.find(b => b.check());
    return (branch || this.fallback).step;
  }
}

module.exports = Branch;
