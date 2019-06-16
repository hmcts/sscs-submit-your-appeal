const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const packageJson = require.resolve('govuk-frontend/package.json');
const govUkFrontendRoot = path.resolve(packageJson, '..');
const assets = path.resolve(govUkFrontendRoot, 'assets');
const imagesGokukFrontend = path.resolve(assets, 'images');
const fontsGokukFrontend = path.resolve(assets, 'fonts');

module.exports = {
  target: 'web',
  entry: [
    path.resolve(__dirname, 'assets/scss/main.scss'),
    path.resolve(__dirname, 'assets/js/main.js')
  ],
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
    path: path.resolve('dist'),
    filename: '[name].js',
    publicPath: '/assets'
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