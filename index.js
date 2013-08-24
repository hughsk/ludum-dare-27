var ticker = require('ticker')
var createGame = require('./game')
var canvas = document.getElementById('main')

canvas.width = 800
canvas.height = 600

var game = createGame(canvas)

ticker(canvas, 60, 3)
  .on('tick', function() { game.tick() })
  .on('draw', function() { game.draw() })

document.body.appendChild(canvas)
