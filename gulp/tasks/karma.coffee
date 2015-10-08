gulp = require 'gulp'
config = require '../config'
$ = (require 'gulp-load-plugins')()

gulp.task 'karma', ->
    return gulp.src(config.files.test)
        .pipe($.karma(
            configFile: 'karma.conf.js'
            action: 'watch'
        ))
