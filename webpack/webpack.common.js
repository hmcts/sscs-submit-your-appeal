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

module.exports = {
  target: 'web',
  entry: [
    path.resolve(__dirname, '../assets/scss/main.scss'),
    path.resolve(__dirname, '../assets/js/main.js')
  ],
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: path.resolve('assets/images'), to: 'images' },
          { from: path.resolve('assets/locale'), to: 'locale' },
          { from: path.resolve('views/components'), to: 'nunjucks/components' },
          { from: imagesGokukFrontend, to: 'images' },
          { from: fontsGokukFrontend, to: 'fonts' }
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
        loader: 'nunjucks-loader'
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
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: { quietDeps: true }
            }
          }
        ]
      }
    ]
  }
};
