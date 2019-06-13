const webpack = require('webpack');
const webpackDev = require('webpack-dev-middleware');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const logger = require('logger');
const serveStatic = require('serve-static');
const path = require('path');

const logPath = 'webpack.js';

const isDev = () => process.env.NODE_ENV === 'development';


const packageJson = require.resolve('govuk-frontend/package.json');
const govUkFrontendRoot = path.resolve(packageJson, '..');
const assets = path.resolve(govUkFrontendRoot, 'assets');
const imagesGokukFrontend = path.resolve(assets, 'images');
const fontsGokukFrontend = path.resolve(assets, 'fonts');

const webpackSettings = () => {
  const defaults = {
    entry: [
      path.resolve(__dirname, 'assets/scss/main.scss'),
      path.resolve(__dirname, 'assets/js/main.js')
    ],
    devtool: 'inline-source-map',
    plugins: [
      new CopyWebpackPlugin(
        [
          { from: path.resolve(__dirname, 'assets/images'), to: 'images' },
          { from: path.resolve(__dirname, 'views/components'), to: 'nunjucks/components' },
          { from: imagesGokukFrontend, to: 'images' },
          { from: fontsGokukFrontend, to: 'fonts' }
        ]),
      new MiniCssExtractPlugin({ filename: '[name].css' })
    ],
    output: {
      path: path.resolve('./dist'),
      filename: '[name].js'
    },
    externals: [{ window: 'window' }],
    module: {
      rules: [
        {
          test: /\.(png|jpg)$/i,
          loaders: ['file-loader']
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
              options: { presets: ['env'] }
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

  return defaults;
};

const configureWebpack = app => {
  const assetPath = app.get('assetPath');
  const _webpackSettings = webpackSettings(assetPath);
  const _webpack = webpack(_webpackSettings);

  app.set('webpackSettings', _webpackSettings);
  app.set('webpack', _webpack);

  if (isDev()) {
    const defaultSettings = {
      publicPath: '/assets/',
      logLevel: 'warn'
    };
    app.use(webpackDev(_webpack, Object.assign(defaultSettings, {})));
  } else {
    logger.trace('Configuring production settings', logPath);

    app.get('webpack').run((error, stats) => {
      if (error) {
        logger.exception(error);
      }
      if (stats) {
        const time = stats.endTime - stats.startTime;
        logger.trace(`Webpack build complete in ${time}ms. Hash ${stats.hash}`, logPath);
        logger.trace(stats, logPath);
      }
    });
    const staticSettings = {
      dotfiles: 'ignore',
      index: false
    };
    app.use('/assets', serveStatic(path.resolve('./dist'), staticSettings));
  }

  return app;
};

module.exports = { configureWebpack };
