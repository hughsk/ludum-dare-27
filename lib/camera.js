var lerp = require('vectors/lerp')(2)

module.exports = Camera

function Camera(game, field) {
  if (!(this instanceof Camera)) return new Camera(game, field)

  this.game = game
  this.field = field
  this.target = [0, 0]
  this.pos = [0, 0]
}

Camera.prototype.tick = function() {
  lerp(this.target, this.pos, this.target, 0.01)
  this.field.move(this.target)
}
