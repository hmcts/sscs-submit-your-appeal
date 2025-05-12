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
    '**/node_modules/',
    'test',
    'assets/js/date-picker/bootstrap-datepicker1.9.0.min.js',
    'assets/js/polyfill',
    '**/dist/',
    '**/cookie-banner/',
    '.yarn/'
  ]), {
    extends: compat.extends('@hmcts'),

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        ...globals.browser
      },

      ecmaVersion: 2020,
      sourceType: 'module'
    },

    rules: {
      'linebreak-style': ['warn', 'unix'],
      'no-process-env': 'off',
      'multiline-ternary': ['error', 'always-multiline'],
      'operator-linebreak': ['error', 'after'],
      'newline-per-chained-call': 'off',

      'object-curly-newline': [
        'error', {
          consistent: true
        }
      ],

      'max-len': [
        'error', {
          code: 160
        }
      ],

      'line-comment-position': 'off',
      'global-require': 'off'
    }
  }
]);