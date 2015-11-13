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
        extensions: ['', '.js', '.jsx', '.json'],
        modulesDirectories: ['node_modules'],
        alias: {
            'sections': path.resolve(__dirname, './src/sections'),
            'lib': path.resolve(__dirname, './src/lib/'),
            'assets': path.resolve(__dirname, './assets/'),
            'event-source': require.resolve('event-source-polyfill'),
            'fake': path.resolve(__dirname, './fake/fake.js'),
            'diagnostics': path.resolve(__dirname, './diagnostics/diagnostics.js'),
            '$jquery': path.resolve(__dirname, './src/lib/modules/jquery-hud.js')
         }
     },
    module: {
        loaders: [
            { test: /\.scss$/, loader: 'style!css!autoprefixer?browsers=last 2 version!sass?includePaths[]=' + (path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets/')) },
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
    log: {
        colors: true,
        hash: true,
        timings: true,
        assets: true,
        chunkModules: false
    }
};
