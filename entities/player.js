var Box2D = require('box2dweb-commonjs').Box2D
var b2Player = require('box2d-player')(Box2D)
var bs = require('bindlestiff')

var round = Math.round
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef
var b2BodyDef = Box2D.Dynamics.b2BodyDef
var b2Vec2 = Box2D.Common.Math.b2Vec2
var b2Body = Box2D.Dynamics.b2Body
var tempPosition = [0,0]

var player = bs.component('player')
  .needs('physical')
  .needs('attached')
  .needs('controllable')
  .on('init', function() {
    var x = this.game.width / 60
    var y = this.game.height / 60

    var def = new b2BodyDef
    def.position = new b2Vec2(0, -5)
    def.type = b2Body.b2_dynamicBody
    def.userData = null
    def.fixedRotation = true

    this.body = this.world.CreateBody(def)

    var fixdef = new b2FixtureDef
    fixdef.shape = new b2CircleShape(0.49)

    this.fixture = this.body.CreateFixture(fixdef)

    this.b2p = new b2Player(this.world, {
        body: this.body
      , fixture: this.fixture
      , jumpHeight: 20
    })

    this.b2Pos = this.body.m_xf.position
  })
  .on('tick', function() {
    this.body.m_linearVelocity.x =
        this.controls.left  ? -14
      : this.controls.right ? +14
      : 0

    if (this.controls.jump) this.b2p.jump()

    tempPosition[0] = round(this.b2Pos.x)
    tempPosition[1] = round(this.b2Pos.y)
    this.game.field.move(tempPosition)
  })
  .on('draw', function(ctx, game) {
    ctx.fillStyle = '#FFCFBF'
    var x = this.b2p.body.m_xf.position.x * 30 - 15 - game.camera.pos[0]
    var y = this.b2p.body.m_xf.position.y * 30 - 15 - game.camera.pos[1]
    ctx.fillRect(x, y, 30, 30)
  })

module.exports = bs.define()
  .use(require('../components/attached'))
  .use(require('../components/physical'))
  .use(require('../components/controllable'))
  .use(player)
