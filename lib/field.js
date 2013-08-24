var continuous = require('ndarray-continuous')
var observer = require('continuous-observer')
var cb2d = require('continuous-box2d')(require('box2dweb-commonjs').Box2D)
var cave = require('cave-automata-2d')
var zero = require('zeros')

module.exports = Field

function Field(game) {
  if (!(this instanceof Field)) return new Field(game)

  this.game = game
  this.grid = continuous({
      shape: [32, 32]
    , getter: function(position, done) {
      var shape = this.shape
      process.nextTick(function() {
        return done(null, cave(zero(shape))(10))
      })
    }
  })

  this.move = observer(this.grid)

  cb2d(this.game.world, this.grid, {
    data: function(_, pos) {
      return {
          type: 'wall'
        , pos: pos
      }
    }
  })
}

