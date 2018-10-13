const webpack = require('webpack');
const merge = require('webpack-merge');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const path = require('path');
const fs = require('fs');
const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build'),
    test: path.join(__dirname, 'tests')
};

process.env.BABEL_ENV = TARGET;

const common = {
    resolve: {
        modules: [path.resolve(__dirname), 'node_modules'],
        extensions: ['.js']
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.styl$/,
                loader:
                    'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
            },
            {
                test: /\.png($|\?)|\.jpg($|\?)|\.gif($|\?)/,
                loader: ['file-loader']
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)|\.otf($|\?)/,
                loader: 'file-loader'
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};

if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        entry: {
            app: PATHS.app + '/index.js'
        },
        mode: 'development',
        watchOptions: {
            ignored: /node_modules/
        },
        devtool: 'inline-source-map',
        devServer: {
            disableHostCheck: true,
            contentBase: PATHS.build,
            historyApiFallback: true,
            hot: true,
            stats: 'errors-only',
            host: '0.0.0.0',
            port: 4004,
            https: {
                cert: fs.readFileSync('/code/ssl/cer.crt'),
                key: fs.readFileSync('/code/ssl/rsa.key'),
                ca: fs.readFileSync('/code/ssl/localca.pem')
            }
        },
        plugins: [
            new ErrorOverlayPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            })
        ]
    });
}

if (['build-back', 'build-front'].indexOf(TARGET) !== -1) {
    module.exports = merge(common, {
        entry: {
            app: PATHS.app + '/' + TARGET.split('-')[1] + '/index.js'
        },
        mode: 'production',
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                version: new Date().getTime(),
                template: './src/index.html'
            })
        ]
    });
}
