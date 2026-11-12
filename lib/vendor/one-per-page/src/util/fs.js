const fs = require('fs');
const callbackGlob = require('glob');

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

const glob = pattern => new Promise((resolve, reject) => {
  callbackGlob(pattern, {}, (error, filepaths) => {
    if (error) {
      reject(error);
    } else {
      resolve(filepaths);
    }
  });
});

module.exports = { fileExists, readFile, readJson, glob };
