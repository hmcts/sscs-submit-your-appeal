function makeDir(path, dirCallback) {
  const p = pt.join(__dirname, path);
  fs.stat(p, (fsError, stats) => {
    if (fsError || !stats.isDirectory()) {
      return fs.mkdir(p, dirCallback);
    }
    return dirCallback();
  });
}

module.exports = { makeDir };