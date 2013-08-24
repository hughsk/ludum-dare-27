var bs = require('bindlestiff')

module.exports = harmful

var cache = {}
function harmful(toPlayer) {
  toPlayer = !!toPlayer
  return cache[toPlayer] = cache[toPlayer] ||
    bs.component('harmful')
      .needs('body')
      .on('init', function() {
        this.body.m_userData.harmful = toPlayer ? 1 : -1
      })
}
