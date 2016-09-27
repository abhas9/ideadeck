var gulp = require('gulp');
var gs = require('gulp-selectors');
var minify = require('gulp-minifier');
var imagemin = require('gulp-imagemin');
var dest = './public';

gulp.task('buildIndex', function() {
  gulp.src(['./src/**/styles.css', './src/**/index.html'])
    .pipe(gs.run({
      'css': ['css'],
      'html': ['html']
    }, {
      ids: '*', // ignore all IDs,
      classes: ['c_*']
    }))
    .pipe(minify({
      minify: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true,
      minifyCSS: true,
      getKeptComment: function(content, filePath) {
        var m = content.match(/\/\*![\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
      }
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('minifyCSS', function() {
  gulp.src(['./src/**/form.css', './src/**/gallery.css',
      './src/**/carousel.css', './src/**/success.css'
    ])
    .pipe(minify({
      minify: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true,
      minifyCSS: true,
      getKeptComment: function(content, filePath) {
        var m = content.match(/\/\*![\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
      }
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('images', function() {
  var imgSrc = './src/**/*.+(jpg|png|svg|gif)',
    imgDst = dest;
  return gulp.src(imgSrc)
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

gulp.task('default', ['images', 'buildIndex', 'minifyCSS']);
