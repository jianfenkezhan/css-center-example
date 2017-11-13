'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const minicss = require('gulp-mini-css');
const header = require('gulp-header');
const del = require('del');

const pkg = require('./package.json');
const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
''].join('\n');

const paths = {
  script: 'public/js/*.js',
  css: 'public/css/*.css',
  images: 'public/images/*'
}

gulp.task('clean', function() {
  return del(['build']);
})

gulp.task('script', ['clean'], function() {
  return gulp.src(paths.script)
    .pipe(sourcemaps.init())
      .pipe(header(banner, { pkg : pkg } ))
      .pipe(uglify())
      .pipe(concat('index.min.js'))
    .pipe(sourcemaps.write())
  .pipe(gulp.dest('bulid/js'))
})

gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
      multipass: true
    }))
  .pipe(gulp.dest('build/img'));
})

gulp.task('css', ['clean'], function() {
  return gulp.src(paths.css)
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(minicss())
  .pipe(gulp.dest('build/img'));
})

gulp.task('watch', function() {
  gulp.watch(paths.script, ['script']);
  gulp.watch(paths.images, ['images']);
});

gulp.task('default', ['watch', 'script,', 'css', 'images'], function() {
  console.log("Gulp 领跑前端流自动化构建----Awesomes")
});