const path = require('path');
const common = require('./config.common');

module.exports = Object.assign({}, common, {
    devtool: 'source-map',
    entry: path.join(__dirname, '../src/js/index.jsx'),
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'source-map-loader',
            },
        ],
        loaders: [
            {
                exclude: /node_modules/,
                loaders: ['babel-loader', 'eslint-loader'],
                test: /\.jsx?$/,
            },
        ],
    },
    output: {
        filename: 'app.js',
    },
});
