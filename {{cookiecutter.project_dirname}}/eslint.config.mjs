import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import importX from 'eslint-plugin-import-x'
import prettierPlugin from 'eslint-plugin-prettier'
import promisePlugin from 'eslint-plugin-promise'
import securityPlugin from 'eslint-plugin-security'
import testingLibrary from 'eslint-plugin-testing-library'

const eslintConfig = defineConfig([
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  promisePlugin.configs['flat/recommended'],
  securityPlugin.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'better-tailwindcss': betterTailwindcss
    },
    rules: betterTailwindcss.configs.recommended.rules,
    settings: {
      'better-tailwindcss': {
        entryPoint: 'styles/globals.css'
      }
    }
  },
  prettierConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'import-x': importX,
      prettier: prettierPlugin
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: '19.2'
      }
    },
    rules: {
      camelcase: [2, { properties: 'always' }],
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'prefer-arrow-callback': 'error',
      'prettier/prettier': 'error',
      'react/no-unescaped-entities': 0,
      'react/prop-types': 0,
      'security/detect-object-injection': 0,
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'better-tailwindcss/no-unknown-classes': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'import-x/order': [
        'warn',
        {
          alphabetize: {
            caseInsensitive: true,
            order: 'asc'
          },
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type'
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@/components/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/utils/**',
              group: 'internal',
              position: 'after'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['__tests__/**/*.{ts,tsx}'],
    plugins: {
      'testing-library': testingLibrary
    },
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      }
    },
    rules: {
      'testing-library/await-async-events': 'warn',
      'testing-library/no-container': 'warn',
      'testing-library/no-node-access': 'warn',
      'testing-library/no-test-id-queries': 'warn',
      'testing-library/no-unnecessary-act': 'warn',
      'testing-library/prefer-screen-queries': 'warn',
      'testing-library/prefer-user-event': 'warn'
    }
  },
  {
    files: ['cypress/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        context: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    }
  },
  {
    files: ['cypress.config.ts', 'jest.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '**/*.js',
    '**/*.mjs',
    '**/*.d.ts'
  ])
])

export default eslintConfig
