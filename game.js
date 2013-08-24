var Manager = require('bindlestiff/manager')
var inherits = require('inherits')
var trap = require('pointer-trap')
var fps = require('fps')

var camera = require('./lib/camera')
var field = require('./lib/field')

var Box2D = require('box2dweb-commonjs').Box2D
var b2World = Box2D.Dynamics.b2World
var b2Vec2 = Box2D.Common.Math.b2Vec2

module.exports = Game

function Game(canvas) {
  if (!(this instanceof Game)) return new Game(canvas)

  Manager.call(this)

  this.canvas = canvas
  this.ctx = canvas.getContext('2d')
  this.width = canvas.width
  this.height = canvas.height
  this.tickrate = 1 / 60

  this.gravity = new b2Vec2(0, 40)
  this.world = new b2World(this.gravity, true)

  this.field = field(this)
  this.camera = camera(this, this.field)

  this.pointer = trap(this.canvas)
  this.mouse = this.pointer.pos
  this.mouse.x = +this.mouse.x|0
  this.mouse.y = +this.mouse.y|0
}
inherits(Game, Manager)

// Important: components and the like should be
// required HERE, NOT ABOVE. Weird circular dependency
// issues.
Game.prototype.start = function() {
  this.player = new (require('./entities/player'))
  this.add(this.player)
}

var framecounter = fps({ every: 1, decay: 0.5 })
Game.prototype.tick = function() {
  framecounter.tick()
  this.world.Step(this.tickrate, 8, 3)
  this.camera.tick()

  var l = this.instances.length
  for (var i = 0; i < l; i += 1)
    this.instances[i].trigger('tick')
}

Game.prototype.draw = function() {
  this.ctx.fillStyle = '#D05931'
  this.ctx.fillRect(0, 0, this.width, this.height)

  var world = this.world
  var width = this.width
  var height = this.height
  var ctx = this.ctx
  var mousex = this.mouse.x
  var mousey = this.mouse.y
  var camx = this.camera.pos[0]
  var camy = this.camera.pos[1]
  var floor = Math.floor

  ctx.fillStyle = '#362F34'
  for (var obj = world.GetBodyList(); obj; obj = obj.GetNext()) {
    data = obj.GetUserData()
    if (!data) continue
    if (data.type === 'wall') {
      var x = floor(data.pos[0] * 30 - camx)
        , y = floor(data.pos[1] * 30 - camy)
        , w = floor(data.pos[2] * 30)
        , h = floor(data.pos[3] * 30)
      if (
        x + w >= 0 ||
        y + h >= 0 ||
        x < width ||
        y < height
      ) {
        ctx.fillRect(x, y, w, h)
      }
    }
  }

  var l = this.instances.length
  for (var i = 0; i < l; i += 1)
    this.instances[i].trigger('draw', ctx, this)

  ctx.fillStyle = '#FFCFBF'
  ctx.fillRect(mousex - 3, mousey - 3, 6, 6)

  this.camera.draw()
}
