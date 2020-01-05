const { server, reload } = require('./series/server');
const { rollup } = require('./series/rollup')
const clean = require('./series/clean');
const lint = require('./series/lint')
const less = require('./series/less')
const gulp = require('gulp')

gulp.task('clean', clean.all)
gulp.task('cleanJS', clean.cleanJS)
gulp.task('cleanCSS', clean.cleanCSS)
gulp.task('lint', lint)
gulp.task('rollup', rollup)
gulp.task('less', less)
gulp.task('server', server)
gulp.task('reload', reload)

// watchers
const watcher = function(done) {
  gulp.watch(['src/**/*.ts'], gulp.series('lint', 'cleanJS', 'rollup', 'reload'))
  gulp.watch(['examples/**/*.html'], gulp.series('reload'))
  gulp.watch(['theme/**/*.less'], gulp.series('cleanCSS', 'less', 'reload'))
  done()
}

// gulp tasks
const defaults = {
  'production': gulp.series('clean', 'lint', 'rollup', 'less'),
  'development': gulp.series('clean', 'lint', 'rollup', 'less', 'server', watcher)
}

gulp.task('default', defaults[process.env.NODE_ENV]);