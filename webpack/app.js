const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const sass = path.resolve(__dirname, '../assets/scss');
const images = path.resolve(__dirname, '../assets/images');
const views = path.resolve(__dirname, '../views/components');

const copyImages = new CopyWebpackPlugin({
  patterns: [{ from: images, to: '../dist/images' }]
});

const copyViews = new CopyWebpackPlugin({
  patterns: [{ from: views, to: '../dist/nunjucks/components' }]
});

module.exports = {
  paths: { sass },
  plugins: [copyImages, copyViews]
};
