module.exports = {
    'env': {
        'browser': true,
    },
    'rules': {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

        // react rules
        'react/jsx-indent': [2, 4],
        'react/jsx-indent-props': [2, 4],
        'react/jsx-no-bind': [2, {
            'ignoreRefs': true,
            'allowArrowFunctions': true,
            'allowBind': false,
        }],
        'react/jsx-closing-bracket-location': [2, {
            'nonEmpty': 'after-props',
            'selfClosing': 'tag-aligned',
        }],
    },
};
