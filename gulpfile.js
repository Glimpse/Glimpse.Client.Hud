'use strict';

var _ = require('lodash');
var del = require('del');
var gulp = require('gulp');
var argv = require('minimist')(process.argv.slice(2));
var webpack = require('webpack');
var browserSync = require('browser-sync');
var htmlcompress = require('gulp-minify-html');
var gutil = require('gulp-util');
var gif = require('gulp-if');
// var filelog = require('gulp-filelog');  // NOTE: Used for debug
var runSequence = require('run-sequence');
var zip = require('gulp-zip');
var gulpRename = require('gulp-rename');

var settings = {
    index: __dirname + '/src/index.html',
    entry: __dirname + '/src/bootstrap.js',
    output: __dirname + '/.dist',
    outputDev: __dirname + '/.dist/dev',
    outputProd: __dirname + '/.dist/prod',
    archive: __dirname + '/.archive',
    archiveDev: __dirname + '/.archive/dev',
    archiveProd: __dirname + '/.archive/prod',
    assets: __dirname + '/assets/**/*'
};

var WATCH = !!argv.watch;
var RELEASE = !!argv.release;
var DEBUG = !!argv.debug;

function getOutputDirectory() {
    if (RELEASE) {
        return settings.outputProd;
    }
    else {
        return settings.outputDev
    }
}

function getBundleConfig() {
    var config = _.defaultsDeep({}, require('./webpack.config'));

    config.entry = settings.entry;
    config.output.path = getOutputDirectory();

    if (WATCH) {
        // config.chunkModules = false;
        config.watch = true;
    }

    if (RELEASE) {
        config.plugins = config.plugins.concat(
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true
            }),
            new webpack.optimize.OccurrenceOrderPlugin()
        );
    } else {
        config.output.pathinfo = true;
    }

    config.devtool = (RELEASE) ? 'source-map' : 'cheap-module-eval-source-map';

    return config;
}

gulp.task('bundle', function (cb) {
    var started = false;
    var config = getBundleConfig();
    function processResult(err, stats) {
        gutil.log('Webpack\n' + stats.toString(config.log));

        if (config.watch) {
            browserSync.reload(settings.entry);
        }

        if (!started) {
            started = true;
            cb();
        }
    }

    var compiler = webpack(config);
    if (config.watch) {
        compiler.watch(200, processResult);
    } else {
        compiler.run(processResult);
    }

});

gulp.task('pages', function () {
    return gulp.src(settings.index)
        .pipe(gif(RELEASE, htmlcompress()))
        .pipe(gulp.dest(getOutputDirectory()))
        .pipe(gif(WATCH, browserSync.reload({ stream: true })));
});

gulp.task('assets', function () {
    return gulp.src(settings.assets)
        .pipe(gulp.dest(getOutputDirectory() + '/assets'))
        .pipe(gif(WATCH, browserSync.reload({ stream: true })));
});

gulp.task('clean', ['clean-dist', 'clean-archive']);

gulp.task('clean-archive', function () {
    return del(settings.archive + '/**');
});

gulp.task('clean-dist', function () {
    return del(settings.output + '/**');
});

// NOTE: was running in parallel but don't like the output
//gulp.task('build', ['pages', 'bundle']);
gulp.task('build', function (cb) {
    runSequence('pages', 'assets', 'bundle', cb);
});

gulp.task('build-dev', function (cb) {
    RELEASE = false;
    runSequence('build', cb);
});

gulp.task('build-prod', function (cb) {
    RELEASE = true;
    runSequence('build', cb);
});

gulp.task('server', function (cb) {
    browserSync({
        server: {
            baseDir: [settings.output]
        }
    });

    cb();
});

gulp.task('dev', function (cb) {
    WATCH = true;

    runSequence('build-dev', 'server', cb);
});

gulp.task('prod', function (cb) {
    WATCH = true;

    runSequence('build-prod', 'server', cb);
});

gulp.task('archive-dev', ['build-dev'], function () {
    return gulp.src(['.dist/dev/**'])
        .pipe(zip('hud.zip'))
        .pipe(gulp.dest('.archive/dev'))
        .pipe(gulpRename('hud-dev.zip'))
        .pipe(gulp.dest('.archive/dev'));
});

gulp.task('archive-prod', ['build-prod'], function () {
    return gulp.src(['.dist/prod/**'])
        .pipe(zip('hud.zip'))
        .pipe(gulp.dest('.archive/prod'));
});

gulp.task('default', ['dev']);
