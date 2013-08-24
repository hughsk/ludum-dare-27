var ticker = require('ticker')
var game = require('./game-instance')

// Need to send a PR to raf...
var fr = 1000 / 60
var _raf =
  global.requestAnimationFrame ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame ||
  global.msRequestAnimationFrame ||
  global.oRequestAnimationFrame ||
  function(fn, el) {
    setTimeout(fn, fr)
  }

function loop() {
  _raf(loop)
  game.tick()
  game.draw()
}

process.nextTick(function() {
  game.start()
  loop()
})
