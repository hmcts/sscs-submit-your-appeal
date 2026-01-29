/* eslint-disable no-invalid-this */
const sanitizer = require('sanitizer');
const traverse = require('traverse');
const emoji = require('node-emoji');
const { flow } = require('lodash');

const sanitizeRequestBody = (req, res, next) => {
  // Strip emojis, remove scripts then restore special characters
  const santizeValue = flow([emoji.strip, sanitizer.sanitize, sanitizer.unescapeEntities]);

  traverse(req.body).forEach(function sanitizeValue(value) {
    if (this.isLeaf) {
      const sanitizedValue = santizeValue(value);
      this.update(sanitizedValue);
    }
  });
  next();
};

module.exports = sanitizeRequestBody;
