var continuous = require('ndarray-continuous')
var cb2d = require('continuous-box2d')(require('box2dweb-commonjs'))
var cave = require('cave-automata-2d')
var zero = require('zeros')

module.exports = Field

function Field(game) {
  if (!(this instanceof Field)) return new Field(game)

  this.grid = continuous({
      shape: [32, 32]
    , getter: function(position, done) {
      var shape = this.shape
      process.nextTick(function() {
        return cave(zero(shape))(10)
      })
    }
  })

  cb2d(this.game.world, this.grid, {})
}

