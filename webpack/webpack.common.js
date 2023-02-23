/* eslint-disable max-len */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

const packageJson = require.resolve('govuk-frontend/package.json');
const govUkFrontendRoot = path.resolve(packageJson, '..');
const assets = path.resolve(govUkFrontendRoot, 'govuk/assets');
const imagesGokukFrontend = path.resolve(assets, 'images');
const fontsGokukFrontend = path.resolve(assets, 'fonts');

process.traceDeprecation = true;

module.exports = {
  target: 'web',
  entry: [
    path.resolve('assets/scss/main.scss'),
    path.resolve('assets/js/main.js')
  ],
  plugins: [
    new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: path.resolve('assets/images'), to: 'images' },
          { from: path.resolve('assets/locale'), to: 'locale' },
          { from: path.resolve('views/components'), to: 'nunjucks/components' },
          { from: imagesGokukFrontend, to: 'images' },
          { from: fontsGokukFrontend, to: 'fonts' },
          { from: path.resolve('cookie-banner/public/js/cookies-manager.js'), to: '' }
        ]
      }),
    new MiniCssExtractPlugin({ filename: '[name].css' })
  ],
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    publicPath: '/assets'
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        // exclude `my-excluded-chunk`
        return chunk.name !== 'hmcts-webchat-gds-v3';
      }
    }
  },
  externals: [{ window: 'window' }],
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/i,
        loader: 'file-loader'
      },
      {
        test: /\.(njk|nunjucks)$/,
        loader: 'nunjucks-loader',
        options: {
          htmlmin: true,
          htmlminOptions: {
            removeComments: true
          }
        }
      },
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
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
};
