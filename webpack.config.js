const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        main: './src/game.ts',
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'game.bundle.js',
        library: {
            name: 'Game',
            type: 'var',
        },
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    }
}