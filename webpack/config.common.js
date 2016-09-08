const path = require('path');

const src = path.join(__dirname, '../src');
module.exports = {
    resolve: {
        alias: {
            '~': path.join(src, 'js'),
            'scss': path.join(src, 'scss'),
        },
    },
};
