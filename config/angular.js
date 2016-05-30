var b2v = require('buffer-to-vinyl');
var gulpNgConfig = require('gulp-ng-config');
var gulp = require('gulp');

var objConfig = { "STRIPE_PUBLISH_KEY": process.env.STRIPE_PUBLISH_KEY };
b2v.stream(new Buffer(JSON.stringify(objConfig)), 'config.js')
    .pipe(gulpNgConfig('app.config'))
    .pipe(gulp.dest('./public/js/'));