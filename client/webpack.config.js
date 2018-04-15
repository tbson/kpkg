const webpack = require('webpack');
const merge = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const TARGET = process.env.npm_lifecycle_event;
const path = require('path');
const fs = require('fs');
const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build'),
    test: path.join(__dirname, 'tests'),
};

process.env.BABEL_ENV = TARGET;

const common = {
    resolve: {
        modules: [path.resolve(__dirname), 'node_modules'],
        extensions: ['.js'],
    },
    output: {
        path: PATHS.build,
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.styl$/,
                loader:
                    'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
            },
            {
                test: /\.png($|\?)|\.jpg($|\?)|\.gif($|\?)|\.webp($|\?)/,
                loader: 'file-loader',
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)|\.otf($|\?)/,
                loader: 'file-loader',
            },
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                include: PATHS.app,
                exclude: /node_modules/,
            },
        ],
    },
};

if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        entry: {
            // app: [PATHS.app],
            app: PATHS.app + '/index.js',
        },
        watchOptions: {
            ignored: /node_modules/,
        },
        devtool: 'eval-source-map',
        // devtool: 'eval'
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
                ca: fs.readFileSync('/code/ssl/localca.pem'),
            },
        },
        plugins: [
            new webpack.NamedModulesPlugin(),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            })
        ],
    });
}

/*
if(TARGET === 'test' || TARGET === 'tdd') {
}
*/

if (['build-back', 'build-front'].indexOf(TARGET) !== -1) {
    module.exports = merge(common, {
        entry: {
            app: PATHS.app + '/' + TARGET.split('-')[1] + '/index.js',
        },
        devtool: 'cheap-module-source-map',
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                },
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                mangle: true,
                compress: {
                    warnings: false, // Suppress uglification warnings
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    screw_ie8: true,
                },
                output: {
                    comments: false,
                },
                exclude: [/\.min\.js$/gi], // skip pre-minified libs
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            new CompressionPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0,
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            })
            /*
            new BundleAnalyzerPlugin({
                analyzerMode: 'server',
                //  The host changed from 127.0.0.0 to make it work when running it in docker container. Maybe you do not need that change.
                analyzerHost: '0.0.0.0',
                analyzerPort: '8888',
                openAnalyzer: false,
            }),
            */
        ],
        stats: {colors: true},
    });
}
