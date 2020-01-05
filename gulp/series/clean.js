const shell = require('shelljs');

module.all = function(done) {
  shell.rm('-rf', process.env.OUTPUT_DIR)
  done()
}

module.cleanJS = function (done) {
  shell.rm('-rf', `${process.env.OUTPUT_DIR}/*.js`)
  done()
}

module.cleanCSS = function (done) {
  shell.rm('-rf', `${process.env.OUTPUT_DIR}/*.css`)
  done()
}

module.exports = module