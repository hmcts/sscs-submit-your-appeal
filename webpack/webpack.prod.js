const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserJSPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  performance: { hints: false },
  optimization: {
    minimizer: [
      new TerserJSPlugin(),
      new CssMinimizerPlugin()
    ]
  }
});