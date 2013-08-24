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
        var ndarray = cave(zero(shape))(10)
        for (var i = 0; i < 15; i += 1) {
          ndarray.set(
              (Math.random() * shape[0])|0
            , (Math.random() * shape[1])|0
            , 0
          )
        }
        return done(null, ndarray)
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

