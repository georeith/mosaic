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
                test: /\.jsx?$/,
                loaders: ['babel-loader', 'eslint-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass'],
            },
        ],
    },
    output: {
        filename: 'app.js',
    },
});
