const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

process.noDeprecation = true;
module.exports = {
    mode: 'development',
    // devtool: 'eval', // faster but no source-maps
    devtool: 'source-map',

    // babel-polyfil is deprecated in favor of corejs
    // https://babeljs.io/docs/en/babel-polyfill
    entry: [
        // 'whatwg-fetch', // fetch polyfill, IE11 only
        'webpack-hot-middleware/client',
        path.resolve(__dirname, 'app/index.jsx')
    ],

    output: {
        path: path.resolve(__dirname, 'public/build'),
        filename: '[name].js',
        publicPath: '/'
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin({
            overlay: {
                sockIntegration: 'whm'
            }
        }),
        new HtmlWebpackPlugin({
            template: 'app/index.tpl.html',
            inject: 'body',
            filename: 'index.html'
        }),
        // NoEmitOnErrorsPlugin and NamedModulesPlugin are deprecated
        // https://dev.to/flexdinesh/upgrade-to-webpack-4---5bc5
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ].filter(Boolean),

    resolve: {
        extensions: ['.js', '.jsx']
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.s?css$/,
                // css loader order
                // https://github.com/postcss/postcss-loader#readme
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: () => [autoprefixer()],
                            }
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                includePaths: [path.resolve(__dirname, './node_modules/')]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/,
                exclude: /fonts/,
                type: 'asset',
            },
            {
                test: /\.(eot|svg|ttf|woff2?)$/,
                exclude: /images/,
                type: 'asset',
            },
            {
                test: /\.(mp3|wav|ogg|flac)$/,
                type: 'asset',
            },
            {
                test: /\.(mp4|avi|ogv|webm)$/,
                type: 'asset',
            },
            // JSON loader built-in by default
            // https://webpack.js.org/loaders/json-loader/
        ]
    }
};
