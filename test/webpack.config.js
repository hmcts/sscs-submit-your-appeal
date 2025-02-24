const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'none',
  externals: [
    nodeExternals({
      allowlist: [
        'jquery',
        'nunjucks',
        'nunjucks-loader',
        /@hmcts/,
        'lodash-es'
      ]
    })
  ],
  target: 'web',
  context: '/',
  resolve: {
    modules: [
      '.',
      __dirname,
      `${__dirname}/node_modules`,
      `${__dirname}../node_modules`,
      `${__dirname}../../node_modules`
    ],
    fallback: {
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      module: false
    }
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
        options: {
          root: path.resolve(__dirname, '/dist/nunjucks')
        }
      }
    ]
  }
};
