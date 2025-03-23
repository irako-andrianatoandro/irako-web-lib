// eslint.config.js
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import angularEslintPlugin from '@angular-eslint/eslint-plugin';
import angularTemplateParser from '@angular-eslint/template-parser';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Global ignores
  {
    ignores: [
      // Dependencies
      'node_modules/',
      'dist/',
      'coverage/',

      // Build artifacts
      '**/*.min.js',
      '**/*.min.css',

      // Generated files
      '**/*.generated.*',
      '**/*.d.ts',

      // Environment configuration
      '.env'
    ]
  },

  // JavaScript base configuration
  js.configs.recommended,
  prettierConfig,

  // Global settings
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'prettier': prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,

      // TypeScript specific rules
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      }],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
            parameterProperties: 'no-public',
          },
        }],
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // General code quality rules
      'prettier/prettier': 'error',
      'complexity': ['warn', 10],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
      'no-duplicate-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Angular component files
  {
    files: ['**/*.component.ts'],
    plugins: {
      '@angular-eslint': angularEslintPlugin,
    },
    rules: {
      ...angularEslintPlugin.configs.recommended.rules,
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      // Removing the problematic rules:
      // '@angular-eslint/no-host-metadata-property': 'error',
      // '@angular-eslint/no-inputs-metadata-property': 'error',
      // '@angular-eslint/no-outputs-metadata-property': 'error',
    },
  },

  // Angular template files
  {
    files: ['**/*.component.html'],
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    languageOptions: {
      parser: angularTemplateParser,
    },
    rules: {
      ...angularTemplatePlugin.configs.recommended.rules,
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/conditional-complexity': ['warn', { maxComplexity: 4 }],
      '@angular-eslint/template/use-track-by-function': 'warn',
      '@angular-eslint/template/accessibility-alt-text': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'warn',
    },
  },
];
