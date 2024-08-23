const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const sass = path.resolve(__dirname, '../assets/scss');
const images = path.resolve(__dirname, '../assets/images');
const locales = path.resolve(__dirname, '../assets/locale');
const views = path.resolve(__dirname, '../views/components');
const webpackTemplates = path.resolve(__dirname, '../views/webpack');

const copyImages = new CopyWebpackPlugin({
  patterns: [{ from: images, to: '../dist/images' }]
});

const copyLocales = new CopyWebpackPlugin({
  patterns: [{ from: locales, to: '../dist/locale' }]
});

const copyViews = new CopyWebpackPlugin({
  patterns: [{ from: views, to: '../dist/nunjucks/components' }]
});

const copyWebpackTemplates = new CopyWebpackPlugin({
  patterns: [{ from: webpackTemplates, to: '../dist/nunjucks/webpack' }]
});

module.exports = {
  paths: { sass },
  plugins: [copyImages, copyLocales, copyViews, copyWebpackTemplates]
};
