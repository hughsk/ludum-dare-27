var createGame = require('./game')
var canvas = document.getElementById('main')

canvas.width = 800
canvas.height = 600

module.exports = createGame(canvas)

document.body.appendChild(canvas)
