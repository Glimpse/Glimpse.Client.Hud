'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: 'NOT SET HERE',
    output: {
        path: 'NOT SET HERE',
        filename: './[name].js',
        chunkFilename: './[id].chunk.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: ['node_modules'],
        alias: {
            'sections': path.resolve(__dirname, './src/sections'),
            'lib': path.resolve(__dirname, './src/lib/'),
            'assets': path.resolve(__dirname, './assets/'),
            'fake': path.resolve(__dirname, './fake/fake.js'),
            'diagnostics': path.resolve(__dirname, './diagnostics/diagnostics.js'),
            '$jquery': path.resolve(__dirname, './src/lib/modules/jquery-hud.js')
         }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                  { loader: 'style-loader' },
                  { loader: 'css-loader' },
                  {
                      loader: 'autoprefixer-loader',
                      query: {
                          browsers: "last 2 versions"
                      }
                  },
                  {
                      loader: 'sass-loader',
                      query: {
                          outputStyle: 'compressed'
                      }
                  }
                ]
            },
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader?cacheDirectory'],
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /event-source/,
                loader: 'imports?this=>window!exports?EventSource=EventSource'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            DIAGNOSTICS: false,
            FAKE_SERVER: false
        })
    ],
    stats: "normal"
};
