/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import config from '@zendeskgarden/eslint-config';
import noticePlugin from '@zendeskgarden/eslint-config/plugins/notice.js';
import prettierConfig from 'eslint-config-prettier';
import typescriptPlugin from '@zendeskgarden/eslint-config/plugins/typescript.js';
import typescriptTypeCheckedPlugin from '@zendeskgarden/eslint-config/plugins/typescript-type-checked.js';

export default [
  ...config,
  noticePlugin,
  prettierConfig,
  {
    languageOptions: {
      parserOptions: {
        requireConfigFile: false
      }
    },
    rules: {
      'no-console': 'off'
    }
  },
  {
    files: ['src/**/*.ts'],
    ...typescriptPlugin,
    ...typescriptTypeCheckedPlugin,
    rules: {
      ...typescriptPlugin.rules,
      ...typescriptTypeCheckedPlugin.rules,
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'n/no-unsupported-features/node-builtins': ['error', { version: '>=21.0.0' }]
    }
  }
];
