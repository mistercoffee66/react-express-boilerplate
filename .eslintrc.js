module.exports = {
    plugins: ['prettier'],
    extends: [
        'airbnb', // base rules, including react
        'airbnb/hooks', // hooks not enabled by default
        'prettier', // disables eslint rules that may conflict with prettier formatting
        'plugin:react/jsx-runtime', // React 17+ no longer needs "import React from 'react' in JSX files and it shouldn't be marked as an error
    ],
    env: {
        browser: true,
        node: true,
    },
    rules: {
        'prettier/prettier': [
            'error',
            // override some prettier defaults
            {
                arrowParens: 'avoid',
                jsxSingleQuote: false,
                singleQuote: true,
                tabWidth: 4,
            },
        ],
        'arrow-parens': [
            // personal preference, advantages outweigh concerns
            // https://github.com/airbnb/javascript/blob/cbf9ade10a2f6f06c9da6dbfa25b344bee4bbef6/README.md#arrows--one-arg-parens
            2,
            'as-needed',
            {
                requireForBlockBody: false,
            },
        ],
        // advantages outweigh concerns
        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-dynamic-require.md
        'import/no-dynamic-require': 0,
        // Prettier's print-width is 80, but this is not a hard limit, it's an ideal target.
        // Setting max-len higher sets a hard limit and allows for options.
        'max-len': [
            2,
            120,
            4,
            {
                ignoreUrls: true,
                ignoreRegExpLiterals: true,
                ignoreTemplateLiterals: true,
            },
        ],
        'react/function-component-definition': 0,
        // to me, this is the most readable option
        // https://eslint.org/docs/latest/rules/space-before-function-paren
        'space-before-function-paren': [
            2,
            { anonymous: 'always', named: 'never', asyncArrow: 'always' },
        ],
        // we should discuss the pros and cons
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
        'react/jsx-props-no-spreading': [
            2,
            {
                explicitSpread: 'ignore',
            },
        ],
        // we should discuss the pros and cons
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md
        'react/prop-types': 0,
        'no-console': 2,
        'import/extensions': [
            2,
            {
                js: 'never',
                jsx: 'never',
                json: 'ignorePackages',
            },
        ],
    },
};
