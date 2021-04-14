module.exports = {
    env: {
        browser: true,
        es2020: true,
        node: true,
    },
    extends: ['airbnb', 'prettier'],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                trailingComma: 'es5',
                singleQuote: true,
                printWidth: 120,
                tabWidth: 4,
            },
        ],
    },
};
