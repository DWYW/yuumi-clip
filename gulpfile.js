/**
 * 获取环境变量
 * @param {String} name 变量名称
 * @returns {String|Object}
 */
const argv = function(name) {
  let argv = process.argv.reduce((acc, item) => {
    const match = item.match(/(\w+)=(\w+)/)

    if (match) {
      acc[match[1]] = match[2]
    }

    return acc
  }, {});

  return name ? argv[name] : argv
}

// 加载环境变量
require('dotenv').config({
  path: `.env.${argv('env')}`
})

require('./gulp')