var gulp = require('gulp'),
  minifyCss = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat');

paths = {
  images: ['public/images/*'],
  vendor: ['public/vendor/*'],
  scripts: ['public/js/*'],
  styles: ['public/stylesheets/general.css', 'public/stylesheets/game.css']
}

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('dist/images'))
})

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(concat('styles.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/stylesheets'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('vendor', function() {
  return gulp.src(paths.vendor)
    .pipe(gulp.dest('dist/vendor'));
});


gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.vendor, ['vendor']);
});

gulp.task('default', ['watch', 'scripts', 'images', 'vendor', 'styles']);
