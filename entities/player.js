var Box2D = require('box2dweb-commonjs').Box2D
var b2Player = require('box2d-player')(Box2D)
var bs = require('bindlestiff')

var tau = Math.PI * 2
var round = Math.round
var abs = Math.abs
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
    this.rotation = 0
    this.rotating = false
    this.lastangle = 1

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
    var xspd = this.body.m_linearVelocity.x =
        this.controls.left  ? -14
      : this.controls.right ? +14
      : 0

    if (this.rotating) {
      this.rotation += xspd > 0
        ? +0.18
        :  xspd < 0
        ? -0.18
        : this.lastangle > 0
        ? +0.18
        : -0.18
      this.lastangle = xspd || this.lastangle
    } else {
      this.rotation = 0
    }

    if (this.controls.jump) this.b2p.jump()
    this.rotating = ((abs(this.body.m_linearVelocity.y)) > 0.2)

    tempPosition[0] = round(this.b2Pos.x)
    tempPosition[1] = round(this.b2Pos.y)
    this.game.field.move(tempPosition)
  })
  .on('draw', function(ctx, game) {
    var x = this.b2p.body.m_xf.position.x * 30 - game.camera.pos[0]
    var y = this.b2p.body.m_xf.position.y * 30 - game.camera.pos[1]
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(
        this.body.m_linearVelocity.x > 0
      ? this.rotation
      : this.rotation
    )
    ctx.fillStyle = '#FFCFBF'
    ctx.fillRect(-15, -15, 30, 30)
    ctx.restore()
  })

module.exports = bs.define()
  .use(require('../components/attached'))
  .use(require('../components/physical'))
  .use(require('../components/controllable'))
  .use(player)
