var ticker = require('ticker')
var game = require('./game-instance')

function loop() {
  ticker(null, 60, 2)
    .on('tick', function() { game.tick() })
    .on('draw', function() { game.draw() })
}

process.nextTick(function() {
  game.start()
  loop()
})
