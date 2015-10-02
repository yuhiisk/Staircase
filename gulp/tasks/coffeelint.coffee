gulp = require 'gulp'
config = require '../config'
$ = (require 'gulp-load-plugins')()

# Lint Coffeescript
gulp.task 'coffeelint', () ->
    return gulp.src(config.files.lib)
        .pipe($.plumber())
        .pipe($.coffeelint())
        .pipe($.coffeelint.reporter('coffeelint-stylish'))
