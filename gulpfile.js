"use strict";

var gulp = require("gulp"),
    tslint = require("gulp-tslint"),
    ts = require("gulp-typescript"),
    runSequence = require("run-sequence"),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge2');

gulp.task("lint", function() {
    var config = { fix: false, formatter: "verbose", emitError: (process.env.CI) ? true : false };

    return gulp.src([
        "./**/**.ts",
        "!./**/*.d.ts",
        "!./node_modules/**/*.ts"
    ])
        .pipe(tslint(config))
        .pipe(tslint.report());
});

var tsProject = ts.createProject("tsconfig.json");

gulp.task('build2', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: true
        }))
        .pipe(gulp.dest('built/local'));
});

gulp.task("build", gulp.series("lint"), function() {
    var tsResults = gulp.src([
        "./src/**/**.ts",
        "!./src/**/*.d.ts",
        "index.ts",
        "typings/main.d.ts"
    ],
        {
            base: "."
        })
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on("error", function(err) {
            process.exit(1);
        });

    return merge([
        tsResults.dts.pipe(gulp.dest('.')),
        tsResults.js.pipe(sourcemaps.write('./')).pipe(gulp.dest('./'))
    ]);
});

gulp.task("default", function(cb) {
    runSequence("build", cb);
});

gulp.task("watch", function() {
    gulp.watch([
        "./**/*.ts",
        "!./**/*.d.ts",
        "!./node_modules/**/*.ts"
    ], gulp.series("build"));
});
