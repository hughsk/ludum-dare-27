var Box2D = require('box2dweb-commonjs').Box2D
var b2e = require('box2d-events')
var bs = require('bindlestiff')

var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef
var b2BodyDef = Box2D.Dynamics.b2BodyDef
var b2Vec2 = Box2D.Common.Math.b2Vec2
var b2Body = Box2D.Dynamics.b2Body

module.exports = bs.define()
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
      fd.shape = new b2CircleShape(0.5)
      return fd
    }
  ))
  .use(require('../components/explosive')(100))
  .use(bs.component()
    .on('init', function() {
      var self = this
      this.c = '#362F34'
      this.r = 15

      b2e(Box2D, this.world).fixture(
        this.fixture
      ).on('begin', function(a, b) {
        if (a.m_body === self.game.player.body)
          self.trigger('explode')
      })
    })
  )
  .use(require('../components/draw-circle')())

