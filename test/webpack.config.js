import path from 'path';
const nodeExternals = require('webpack-node-externals');
module.exports = {
/*
  target: 'web',

  context: __dirname,

  entry: 'mocha!./web.js',*/
//context: __dirname,
  externals: [nodeExternals({
    whitelist: ['jquery', 'nunjucks', 'nunjucks-loader', /@hmcts/]
  })],
  node: {
  //  console: false,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
    module: 'empty'
  },
  target: 'web',
context: '/',
/*  entry: [
    path.resolve(__dirname, '.'),
    path.resolve(__dirname, 'assets/scss/main.scss'),
    path.resolve(__dirname, 'assets/js/main.js')
  ],*/
  resolve: {
     modules: [
       '.',
      __dirname,
      __dirname + '/node_modules',
      __dirname + '../node_modules',
      __dirname + '../../node_modules'
    ]
  },
    resolveLoader: {
    modules: [path.resolve(__dirname, '../node_modules')],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: /test/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: [ "env" ] }
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

/*  resolve: {
    root: [
      __dirname,
      __dirname + '/fixtures/templates',
      __dirname + '/fixtures/custom_modules'
    ]
  },

  resolveLoader: {
    modulesDirectories: ['web_loaders', 'web_modules', 'node_loaders', 'node_modules', '../']
  }*/

};