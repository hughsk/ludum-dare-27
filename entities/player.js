var Box2D = require('box2dweb-commonjs').Box2D
var b2Player = require('box2d-player')(Box2D)
var bs = require('bindlestiff')

var b2BodyDef = Box2D.Dynamics.b2BodyDef
var b2Vec2 = Box2D.Common.Math.b2Vec2
var b2Body = Box2D.Dynamics.b2Body

var special = bs.component('player')
  .needs('physical')
  .needs('attached')
  .on('init', function() {
    var x = this.game.width / 60
    var y = this.game.height / 60

    var def = new b2BodyDef
    def.position = new b2Vec2(0, 0)
    def.type = b2Body.b2_dynamicBody
    def.userData = null
    def.fixedRotation = true

    var body = this.world.CreateBody(def)

    this.b2p = new b2Player(this.world, { body: body })
    this.b2Pos = this.b2p.body.m_xf.position
  })
  .on('draw', function(ctx, game) {
    ctx.fillStyle = '#00f'
    var x = this.b2Pos.x * 30 - 15 - game.camera.pos[0]
    var y = this.b2Pos.y * 30 - 15 - game.camera.pos[1]
    ctx.fillRect(x, y, 30, 30)
  })

module.exports = bs.define()
  .use(require('../components/attached'))
  .use(require('../components/physical'))
  .use(special)
