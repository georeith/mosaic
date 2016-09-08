module.exports = {
    'root': true,
    'extends': 'airbnb',
    'parser': 'babel-eslint',
    'settings': {
        'import/resolver': {
            'webpack': {
                'config': './webpack/config.common.js',
            },
        },
    },
    'globals': {
        'createImageBitmap': true,
    },
    'rules': {
        'no-console': 0,
        'no-use-before-define': [2, 'nofunc'],
        'indent': [2, 4, { 'SwitchCase': 1, 'VariableDeclarator': 1 }],
        'import/no-unresolved': [2, { 'ignore': ['^(~|sass)/'] }], // temporary workaround until https://github.com/AtomLinter/linter-eslint/issues/610 is solved
        'max-len': [0, 100, 4],
        'quote-props': ['error', 'consistent'],
    },
};
