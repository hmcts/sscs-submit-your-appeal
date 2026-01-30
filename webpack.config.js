const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const govukFrontend = require(path.resolve(__dirname, 'webpack/govukFrontend'));
const scss = require(path.resolve(__dirname, 'webpack/scss'));
const app = require(path.resolve(__dirname, 'webpack/app'));
const webpack = require('webpack');

const devMode = process.env.NODE_ENV !== 'production';
const filename = '[name].js';

module.exports = {
  target: 'web',
  plugins: [
    ...govukFrontend.plugins,
    ...scss.plugins,
    ...app.plugins,
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    new CleanWebpackPlugin()
  ],
  entry: [
    path.resolve('assets/scss/main.scss'),
    path.resolve('assets/js/main.js')
  ],
  mode: devMode ? 'development' : 'production',
  module: {
    rules: [
      ...scss.rules,
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'] }
          }
        ]
      },
      {
        test: /\.(png|jpg)$/i,
        loader: 'asset/resource'
      },
      {
        test: /\.(njk|nunjucks)$/,
        loader: 'nunjucks-loader'
      }
    ]
  },
  output: {
    path: path.resolve('dist'),
    publicPath: '/assets',
    filename
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        // exclude `my-excluded-chunk`
        return chunk.name !== 'hmcts-webchat-gds-v3';
      },
      name: (module, chunks, cacheGroupKey) => {
        const allChunksNames = chunks.map(chunk => chunk.name).join('~');
        const prefix = cacheGroupKey === 'defaultVendors' ? 'vendors' : cacheGroupKey;
        return `${prefix}~${allChunksNames}`;
      }
    },
    minimizer: [ devMode ? false : (new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()) ]
  },
  externals: [{ window: 'window' }],
  performance: { hints: devMode ? 'error' : false },
  devtool: devMode ? 'inline-source-map' : false
};
