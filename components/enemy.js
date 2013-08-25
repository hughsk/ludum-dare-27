var Box2D = require('box2dweb-commonjs').Box2D
var lighten = require('../lib/color').lighten
var bs = require('bindlestiff')

var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef
var b2BodyDef = Box2D.Dynamics.b2BodyDef
var b2Vec2 = Box2D.Common.Math.b2Vec2
var b2Body = Box2D.Dynamics.b2Body

module.exports = function(
    size
  , speed
  , shape
  , style
) {
  return bs.define()
    .use(require('../components/attached'))
    .use(require('../components/physical'))
    .use(require('../components/health')(5))
    .use(bs.component()
      .on('init', function() {
        this.base_r =
        this.r = size * 15 * (Math.random() * 0.25 + 0.75)
        this.c = '#EB3E38'
        this.flinch = 0
      })
      .on('tick', function() {
        this.flinch *= 0.95
        if (this.flinch)
        if (this.flinch < 0.0025) {
          this.flinch = 0
          this.c = '#EB3E38'
          this.r = this.base_r
        } else {
          this.c = lighten('#EB3E38', (this.flinch * 200)|0)
          this.r = this.base_r * (1 - this.flinch * 0.4)
        }
      })
      .on('damaged', function() {
        this.flinch = 1
      })
      .on('died', function() {
        this.flagged = true
      })
    )
    .use(require('../components/body')(
      function createBody() {
        var bd = new b2BodyDef
        bd.position = new b2Vec2(Math.random()*5, Math.random()*5-5)
        bd.type = b2Body.b2_dynamicBody
        bd.userData = {}
        bd.fixedRotation = false
        bd.m_linearDamping = 1
        return bd
      },
      function createFixture() {
        var fd = new b2FixtureDef
        fd.restitution = 0.5
        fd.shape = new b2CircleShape(0.5 * this.r / 15)
        return fd
      }
    ))
    .use(require('../components/harmful')(0, 1))
    .use(require('../components/target-player')(speed))
    .use(require('../components/vulnerable')(1))
    .use(shapes)

  function shapes(def) {
    return require('../components/draw-circle')()(def)
  }
}
