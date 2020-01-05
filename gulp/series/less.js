const gulp = require('gulp')
const gulpif = require('gulp-if')
const less = require('gulp-less')
let cleanCSS = require('gulp-clean-css');
const lessAutoprefix = require('less-plugin-autoprefix')


const autoprefix = new lessAutoprefix({
  browsers: ['last 2 versions', 'ie >= 8', 'ios >= 8']
})

module.exports = function () {
  return gulp.src('theme/index.less')
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(
      gulpif(process.env.NODE_ENV === 'production', cleanCSS({compatibility: 'ie8'}))
    )
    .pipe(gulp.dest(`${process.env.OUTPUT_DIR}`))
}