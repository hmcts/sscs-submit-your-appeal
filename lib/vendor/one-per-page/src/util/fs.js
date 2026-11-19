const fs = require('fs');
const { glob: asyncGlob } = require('glob');

const fileExists = filepath => new Promise((resolve, reject) => {
  fs.stat(filepath, (error, stats) => {
    if (error) {
      reject(error);
    } else if (stats.isFile()) {
      resolve(filepath);
    } else {
      reject(new Error(`${filepath} is not a file`));
    }
  });
});

const readFile = filepath => new Promise((resolve, reject) => {
  fs.readFile(filepath, (error, contents) => {
    if (error) {
      reject(error);
    } else {
      resolve(contents);
    }
  });
});

const readJson = filepath => readFile(filepath).then(JSON.parse);

const glob = pattern => asyncGlob(pattern, {});


module.exports = { fileExists, readFile, readJson, glob };
