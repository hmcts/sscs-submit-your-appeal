const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/entry.js',
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
  output: {
    path: __dirname,
    filename: 'bundle.js'
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
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  },
  optimization: {
    minimize: true
  }
};