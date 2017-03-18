'use strict';

var webpack = require('webpack');
var path = require('path');

// TODO: At some point factor this better
var progressPlugin = (function () {
    var chars = 0;
    var lastState;
    var lastStateTime;

    return new webpack.ProgressPlugin(function (percentage, msg) {
        var state = msg;
        if (percentage < 1) {
            percentage = Math.floor(percentage * 100);
            msg = percentage + '% ' + msg;
            if (percentage < 100) {
                msg = ' ' + msg;
            }
            if (percentage < 10) {
                msg = ' ' + msg;
            }
        }
        if (percentage > 0) {
            for (; chars > msg.length; chars--) {
                process.stderr.write('\b \b');
            }
            chars = msg.length;
            for (var i = 0; i < chars; i++) {
                process.stderr.write('\b');
            }
            process.stderr.write(msg);
        }
    });
})();

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
                          browsers: "last 2 version"
                      }
                  },
                  {
                      loader: 'sass-loader',
                      query: {
                          includePaths: [ path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets/') ]
                      }
                  }
                ]
              },
            { test: /event-source/, loader: 'imports?this=>window!exports?EventSource=EventSource'}
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            DIAGNOSTICS: false,
            FAKE_SERVER: false
        }),
        progressPlugin
    ],
    stats: "normal"
};
