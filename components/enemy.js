var Box2D = require('box2dweb-commonjs').Box2D
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
        fd.shape = new b2CircleShape(0.5 * size)
        return fd
      }
    ))
    .use(require('../components/harmful')(true))
    .use(require('../components/target-player')(speed))
    .use(shapes)

  function shapes(def) {
    return require('../components/draw-circle')(size * 15, '#EB3E38')(def)
  }
}
