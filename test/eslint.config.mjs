import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores([
    'test/e2e/page-objects/steps.js',
    'test/unit/coverage/',
    '!test'
  ]),
  {
    extends: compat.extends('@hmcts/eslint-config/test'),

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        After: true,
        Before: true,
        Feature: true,
        Scenario: true,
        xScenario: true
      },

      ecmaVersion: 2020,
      sourceType: 'module'
    },

    rules: {
      'no-magic-numbers': 'off',
      'max-lines': 'off',
      'no-unused-expressions': 'off',
      'max-nested-callbacks': 'off',
      'linebreak-style': ['warn', 'unix'],

      'object-curly-newline': [
        'error',
        {
          consistent: true
        }
      ],

      'no-invalid-this': 'off',
      'new-cap': 'off',

      'max-len': [
        'error',
        {
          code: 200
        }
      ],

      'line-comment-position': 'off',
      'no-warning-comments': 'off'
    }
  }
]);
