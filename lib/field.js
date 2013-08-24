var perlin = require('perlin').noise.perlin2
var continuous = require('ndarray-continuous')
var observer = require('continuous-observer')
var cb2d = require('continuous-box2d')(require('box2dweb-commonjs').Box2D)
var cave = require('cave-automata-2d')
var fill = require('ndarray-fill')
var zero = require('zeros')

module.exports = Field

var perlinDensity = -0.35
var perlinScale = 0.075
var caveDensity = 0.505
var caveopts = { density: caveDensity }

function Field(game) {
  if (!(this instanceof Field)) return new Field(game)

  this.game = game
  this.grid = continuous({
      shape: [32, 32]
    , getter: function(position, done) {
      var shape = this.shape
      var ndarray
      return done(null,
        fill(
            ndarray = cave(zero(shape), caveopts)(10)
          , function(x, y) {
            var val = ndarray.get(x, y)
            return val ? (
              perlin(
                    (position[0] * shape[0] + x) * perlinScale
                  , (position[1] * shape[1] + y) * perlinScale
              ) > perlinDensity ? 1 : 0
            ) : val
          })
      )
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

