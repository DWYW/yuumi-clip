const bs = require('browser-sync').create();

exports.server = function(done) {
  bs.init({
    server: {
      baseDir: ['examples', 'dist'],
      index: 'index.html'
    },
    port: Number(process.env.BROWSER_SYNC_PORT),
    ui: {
      port: Number(process.env.BROWSER_SYNC_UI_PORT)
    },
    open: false
  })

  done()
}

exports.reload = function(done) {
  bs.reload()
  done()
}
