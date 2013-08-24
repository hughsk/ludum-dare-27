var ticker = require('ticker')
var game = require('./game-instance')

ticker(game.canvas, 60, 3)
  .on('tick', function() { game.tick() })
  .on('draw', function() { game.draw() })

process.nextTick(function() {
  game.start()
})
