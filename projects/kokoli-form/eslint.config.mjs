// Import the root configuration
import rootConfig from '../../eslint.config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  // Library-specific ignores
  {
    ignores: [
      'dist/',
      'node_modules/',
      '**/*.d.ts',
      'coverage/'
    ]
  },
  ...rootConfig,
  // Override specific configurations for this library
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
      },
    },
  },
  // Library-specific rules
  {
    files: ['**/*.component.ts'],
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'lib', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'lib', style: 'camelCase' },
      ],
    },
  },
];
