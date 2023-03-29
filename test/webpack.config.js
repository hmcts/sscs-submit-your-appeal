const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'none',
  externals: [
    nodeExternals({
      whitelist: ['jquery', 'nunjucks', 'nunjucks-loader', /@hmcts/, 'lodash-es']
    })
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
    module: 'empty'
  },
  target: 'web',
  context: '/',
  resolve: {
    modules: [
      '.',
      __dirname,
      `${__dirname}/node_modules`,
      `${__dirname}../node_modules`,
      `${__dirname}../../node_modules`
    ]
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, '../node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /test/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'] }
          }
        ]
      },
      {
        test: /\.(njk|nunjucks)$/,
        loader: 'nunjucks-loader',
        query: {
          root: path.resolve(__dirname, '/dist/nunjucks')
        }
      }
    ]
  },

  optimization: {
    minimize: true
  }

};