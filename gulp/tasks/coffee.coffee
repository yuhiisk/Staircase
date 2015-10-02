gulp = require 'gulp'
config = require '../config'
$ = (require 'gulp-load-plugins')()

gulp.task 'coffee', () ->
    gulp.src(config.files.static)
        .pipe($.plumber())
        .pipe($.coffee({ bare: true }))
        .pipe(gulp.dest(config.path.js))
        .pipe($.size({ title: 'coffee:static' }))

    return gulp.src(config.files.lib)
        .pipe($.plumber())
        .pipe($.coffee({ bare: true }))
        .pipe($.concat(config.name.js))
        .pipe(gulp.dest(config.path.js))
        .pipe(gulp.dest(config.path.build))
        .pipe($.size({ title: 'coffee:lib' }))
