const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const filename = '[name].css';

const miniCss = new MiniCssExtractPlugin({
  filename,
  chunkFilename: '[id].css'
});

module.exports = {
  rules: [
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        'style-loader',
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: false
          }
        },
        {
          loader: 'css-loader',
          options: {
            url: false
          }
        },
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
            sassOptions: {
              quietDeps: true
            }
          }
        }
      ]
    }
  ],
  plugins: [miniCss]
};
