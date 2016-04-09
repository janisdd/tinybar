var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var umd = require('gulp-umd');
var uglify = require('gulp-uglify');
var license = require('gulp-license');
var rename = require("gulp-rename");

/*
gulp.task('js', function () {
    
    var tsResult =  gulp.src('src/*.ts')
        .pipe(ts({
            module: "commonjs",
            target: "es5",
            removeComments: false,
            declaration: true
        }))

    tsResult
        .pipe(umd({
            exports: function (file) {
                return 'myExport'
            },
            namespace: function (file) {
                return 'TinyBar'
            }
        }))
        .pipe(license('MIT', {tiny: true, year: 2016, organization: 'Janis Dähne'}))

        tsResult.dts.pipe(gulp.dest('dist/js')),
        tsResult.js.pipe(gulp.dest('dist/js'))
})
*/

gulp.task('full', function () {

    var parentFolder = 'dist'

    var tsResult =  gulp.src('src/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts({
            module: "commonjs",
            target: "es5",
            removeComments: false,
            declaration: true
        }))

    var normalJs = tsResult.js
        .pipe(umd({
            exports: function (file) {
                return 'myExport'
            },
            namespace: function (file) {
                return 'TinyBar'
            }
        }))
        .pipe(license('MIT', {tiny: true, year: 2016, organization: 'Janis Dähne'}))
        .pipe(gulp.dest(parentFolder + '/js'))
    

    normalJs
        .pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(sourcemaps.write('./')) //relative path to dist
        .pipe(gulp.dest(parentFolder + '/js'))


    //copy ts files
    //gulp.src('src/*.ts')
    /*
    gulp.src('src_ts/*.ts')
        .pipe(license('MIT', {tiny: true, year: 2016, organization: 'Janis Dähne'}))
        .pipe(gulp.dest(parentFolder + '/ts'))
    */
    
    var tsResult2 =  gulp.src('src_ts/*.ts')
        .pipe(ts({
            module: "commonjs",
            target: "es5",
            removeComments: false,
            declaration: true
        }))
    
    //generate .d.ts files
    tsResult2.dts.pipe(gulp.dest(parentFolder + '/js'))
    
    
    //copy output to test dir
    
    gulp.src('dist/js/tinyBar.js').pipe(gulp.dest('examples/libs'))
    gulp.src('dist/js/tinyBar.d.ts').pipe(gulp.dest('examples/libs'))
    

})
