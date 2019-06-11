const ExtractTextPlugin = require('extract-text-webpack-plugin');
const govukFrontend = require('../../sources/govukFrontend');
const lookAndFeel = require('../../sources/lookAndFeel');

const extractSass = new ExtractTextPlugin({ filename: '[name].css' });

const sass = assetPath => {
  const sassLoader = {
    loader: 'sass-loader',
    options: {
      includePaths: [
        govukFrontend.paths.sass,
        lookAndFeel.paths.sass
      ],
      /* eslint-disable id-blacklist */
      data: `$path: '${assetPath}/images/';`
      /* eslint-enable id-blacklist */
    }
  };
  const scssRule = {
    test: /\.scss$/,
    use: extractSass.extract(['css-loader', sassLoader])
  };

  return { rules: [scssRule], plugins: [extractSass] };
};

module.exports = sass;
