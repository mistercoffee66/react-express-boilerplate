const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
    mode: 'production',
    // babel-polyfil is deprecated in favor of corejs
    // https://babeljs.io/docs/en/babel-polyfill
    entry: [
        // 'whatwg-fetch',
        path.join(__dirname, 'app/index.jsx')
    ],

    output: {
        path: path.join(__dirname, 'public/build'),
        filename: '[name]-[contenthash].min.js',
        publicPath: '/'
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'app/index.tpl.html',
            inject: 'body',
            filename: 'index.html'
        }),
        // TODO: why is this succeeding w local prod build but failing in jenkins?


        // extract-text-webpack-plugin is deprecated in favor of mini-css-extract-plugin
        // https://webpack.js.org/plugins/extract-text-webpack-plugin/
        new MiniCssExtractPlugin({
            filename: path.join('[name]-[contenthash].min.css')
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        // prevents unchanged vendor chunks from getting new hashes based on resolution order
        // https://webpack.js.org/guides/caching/
        new webpack.ids.HashedModuleIdsPlugin()
    ],

    optimization: {
        // extract wenpack boilerplate
        // https://webpack.js.org/guides/caching/
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
        },
        minimizer: [
            '...',
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            ['gifsicle', { interlaced: true }],
                            ['mozjpeg', { progressive: true }],
                            ['pngquant', { optimizationLevel: 5 }],
                            // Svgo configuration here https://github.com/svg/svgo#configuration
                            ['svgo'],
                        ],
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
    },

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
                // extract-text-webpack-plugin is deprecated in favor of mini-css-extract-plugin
                // https://webpack.js.org/plugins/extract-text-webpack-plugin/
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
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
                        loader: 'resolve-url-loader'
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
            }
            // JSON loader built-in by default
            // https://webpack.js.org/loaders/json-loader/
        ]
    }
};
