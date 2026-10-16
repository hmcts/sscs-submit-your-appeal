const { fileExists, readJson, glob } = require('../util/fs');
const { defined } = require('../util/checks');

const langInFilepathRegex = /^.*\.(\w{2}(?:-\w{2})?)\.json$/;
const langRegex = /^\w{2}(?:-\w{2})?$/;

const keyParseError = (key, filepath) =>
  `top level key: ${key} in ${filepath} not a country code`;


const translationMapper = (contents, filepath) => Object
  .keys(contents)
  .map(key => {
    if (defined(key.match(langRegex))) {
      return [{ lang: key, translations: contents[key] }];
    }
    throw new Error(keyParseError(key, filepath));
  })
  .reduce((acc, arr) => [...acc, ...arr], []);

const parseI18N = (filepath, contents) => {
  const match = filepath.match(langInFilepathRegex);

  if (defined(match) && defined(match[1])) {
    return [{ lang: match[1], translations: contents }];
  }

  return translationMapper(contents, filepath);
};

const loadFileContents = (filePath, i18Next) => {
  const addResourceBundles = contents => {
    const bundles = translationMapper(contents, filePath);
    bundles.forEach(({ lang, translations }) => {
      const deep = true;
      const overwrite = true;
      i18Next.addBundleIfModified(
        lang,
        'translation',
        translations,
        deep,
        overwrite
      );
    });
    return i18Next;
  };

  return fileExists(filePath)
    .then(readJson)
    .then(addResourceBundles);
};

const loadStepContent = (step, i18Next) => {
  const addResourceBundles = filepath => contents => {
    const bundles = parseI18N(filepath, contents);
    bundles.forEach(({ lang, translations }) => {
      const deep = true;
      const overwrite = true;
      i18Next.addBundleIfModified(
        lang,
        step.name,
        translations,
        deep,
        overwrite
      );
    });
  };

  const loadContents = filepaths => {
    const loadPromises = filepaths.map(filepath =>
      fileExists(filepath)
        .then(readJson)
        .then(addResourceBundles(filepath))
    );
    return Promise.all(loadPromises);
  };

  const promises = [
    glob('common/*.json').then(loadContents),
    glob(`${step.dirname}/content.json`).then(loadContents),
    glob(`${step.dirname}/content.@(*).json`).then(loadContents),
    glob(`${step.dirname}/${step.name}.json`).then(loadContents),
    glob(`${step.dirname}/${step.name}.@(*).json`).then(loadContents),
    glob(`${step.dirname}/**/*/${step.name}.content.@(*).json`).then(loadContents)
  ];

  return Promise.all(promises);
};

module.exports = { loadStepContent, loadFileContents };
