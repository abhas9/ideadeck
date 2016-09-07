var gulp = require('gulp');
var gs = require('gulp-selectors');
var minify = require('gulp-minifier');

gulp.src(['src/**/*.css', 'src/**/*.html'])
  .pipe(gs.run())
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
  .pipe(gulp.dest('./build'));
