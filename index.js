var ticker = require('ticker')
var raf = require('raf')
var game = require('./game-instance')


raf(game.canvas).on('data', function() {
  game.tick()
  game.draw()
})


// ticker(game.canvas, 60, 3)
//   .on('tick', function() { game.tick() })
  // .on('draw', function() { game.draw() })

process.nextTick(function() {
  game.start()
})
