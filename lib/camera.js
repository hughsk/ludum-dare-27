var lerp = require('vectors/lerp')(2)
var round = Math.round

module.exports = Camera

function Camera(game, field) {
  if (!(this instanceof Camera)) return new Camera(game, field)

  this.game = game
  this.field = field
  this.shape = this.field.grid.shape
  this.pos = [this.game.width / 2, this.game.height / 2]
  this.target = this.pos.slice(0)
}

var temp = []
Camera.prototype.tick = function() {
  lerp(this.target, this.pos, this.target, 0.01)
  temp[0] = round(this.target[0] / this.shape[0])
  temp[1] = round(this.target[1] / this.shape[1])
  this.field.move(temp)
}
