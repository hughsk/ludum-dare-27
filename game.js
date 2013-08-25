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

  this.queue = []

  this.canvas = canvas
  this.ctx = canvas.getContext('2d')
  this.width = canvas.width
  this.height = canvas.height
  this.tickrate = 1 / 60

  this.gravity = new b2Vec2(0, 0.75)
  this.world = new b2World(new b2Vec2, true)

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

  var Spawner = require('./lib/spawner')
  var spawner = new Spawner(this)
}

var framecounter = fps({ every: 1, decay: 0.5 })
Game.prototype.tick = function() {
  framecounter.tick()
  // console.log('prestep')
  this.world.Step(this.tickrate, 8, 3)
  // console.log('poststep')
  this.camera.tick()

  for (var i = 0; i < this.queue.length; i += 1)
    this.add(this.queue[i])
  this.queue.length = 0

  for (var i = 0; i < this.instances.length; i += 1)
    this.instances[i].trigger('tick')
  for (var i = 0; i < this.instances.length; i += 1)
    if (this.instances[i].flagged) {
      this.instances[i].trigger('destroy')
      i -= 1
    }
}

Game.prototype.draw = function() {
  var world = this.world
  var width = this.width
  var height = this.height
  var ctx = this.ctx
  var mousex = this.mouse.x
  var mousey = this.mouse.y
  var camx = this.camera.pos[0]
  var camy = this.camera.pos[1]
  var floor = Math.floor

  this.field.gridCache.each(function(canvas) {
    var x = floor((canvas.position[0]) * canvas.width - camx)
    var y = floor((canvas.position[1]) * canvas.height - camy)
    if (x > -960 && y > -960)
    if (x < width && y < height)
      ctx.drawImage(canvas.canvas, x, y, canvas.width, canvas.height)
  })

  var l = this.instances.length
  for (var i = 0; i < l; i += 1)
    this.instances[i].trigger('draw', ctx, this)

  ctx.fillStyle = '#FFCFBF'
  ctx.fillRect(mousex - 3, mousey - 3, 6, 6)

  // this.ctx.restore()
  this.camera.draw()
}

Game.prototype.enqueue = function(entity) {
  this.queue.push(entity)
}
