// External dependencies
var eslint     = require('gulp-eslint'),
    express    = require('express'),
    gulp       = require('gulp'),
    gzip       = require('gulp-gzip'),
    mocha      = require('gulp-mocha');


// Serve files for local development
gulp.task('serve', function(callback) {
    express()
        .use(function(req, res, next) {
            res.header('Content-Encoding', 'gzip');
            next();
        })
        .use(express.static('build'))
        .use(function(req, res) {
            res.status(404)
                .sendFile(__dirname + '/build/error.html');
        })
        .listen(3000, callback);
});


// Run tests and product coverage
gulp.task('test', ['build'], function () {
    return gulp.src(['test/*.js'])
        .pipe(mocha());
});


// Lint as JS files (including this one)
gulp.task('lint', ['test'], function () {
    return gulp.src([
        'src/js/*.js',
        'gulpfile.js',
        'test/*.js',
        '!node_modules/**'
    ])
    .pipe(eslint({
        extends : 'eslint:recommended',
        rules : {
            'no-undef' : 0
        }
    }))
    .pipe(eslint.format());
});


// Static assets
gulp.task('static', function() {
    return gulp.src('src/static/**')
        .pipe(gzip({ append: false }))
        .pipe(gulp.dest('build'));
});


// Build
gulp.task('build', [
    'static'
]);


// Watch certain files
gulp.task('watch', ['serve', 'lint'], function() {
    gulp.watch(['src/**', 'test/**'], ['lint']);
});


// What to do when you run `$ gulp`
gulp.task('default', ['watch']);