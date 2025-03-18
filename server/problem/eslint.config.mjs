import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    {
        plugins: {
            prettier: eslintPluginPrettier,
        },

        rules: {
            'prettier/prettier': [
                'error',
                {
                    printWidth: 120,
                    tabWidth: 4,
                    useTabs: false,
                    semi: false,
                    singleQuote: true,
                    quoteProps: 'consistent',
                    jsxSingleQuote: true,
                    trailingComma: 'es5',
                    bracketSpacing: true,
                    bracketSameLine: false,
                    arrowParens: 'always',
                    proseWrap: 'always',
                    endOfLine: 'lf',
                    overrides: [
                        {
                            files: '*.json',
                            options: {
                                tabWidth: 2,
                            },
                        },
                    ],
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
]
