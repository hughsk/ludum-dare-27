var Manager = require('bindlestiff/manager')
var inherits = require('inherits')
var trap = require('pointer-trap')
var fill = require('ndarray-fill')
var fps = require('fps')

var camera = require('./lib/camera')
var field = require('./lib/field')

var Box2D = require('box2dweb-commonjs').Box2D
var b2World = Box2D.Dynamics.b2World
var b2Vec2 = Box2D.Common.Math.b2Vec2

var main = new Image
main.src = 'img/main.png'

var TEN_SECONDS = 600

module.exports = Game

function Game(canvas) {
  if (!(this instanceof Game)) return new Game(canvas)

  Manager.call(this)

  this.queue = []
  this.ticks = []
  this.flash = 0

  this.score_display = 0
  this.score  = 0
  this.shot   = 0
  this.title  = true
  this.ready  = false
  this.labels = 1

  this.levelticker = TEN_SECONDS
  this.level  = 1
  this.levels = {
      speed : function(level) { return (Math.pow(level, 0.55) + level / 100) * 0.04 }
    , health: function(level) { return Math.floor(Math.pow(level, 0.4) + level / 100) }
  }

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
  if (this.ready) this.levelticker -= 1
  if (this.levelticker <= 0) this.incLevel()

  for (var i = 0; i < this.ticks.length; i += 1)
    this.ticks[i].call(this)
  this.ticks.length = 0

  framecounter.tick()
  this.world.Step(this.tickrate, 8, 3)
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

Game.prototype.incLevel = function() {
  this.score += 1000
  this.level += 1
  this.levelticker = TEN_SECONDS
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

  if (this.labels)
  if (this.labels < 0.005) {
    this.labels = 0
  } else
  if (this.labels !== 1) {
    this.labels *= 0.99
  }

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

  this.camera.draw()

  if (this.title) {
    ctx.drawImage(main, 200-camx, -145-camy)
    if (this.camera.pos[0] < -this.width)  this.title = false
    if (this.camera.pos[1] < -this.height) this.title = false
  }

  ctx.fillStyle = '#362F34'
  ctx.fillRect(0, 0, this.width, 20)
  ctx.fillStyle = '#EB3E38'
  ctx.fillRect(4, 4, this.width * this.player.health / 15 - 8, 12)

  ctx.fillStyle = '#362F34'
  ctx.fillRect(0, this.height - 20, this.width, 20)
  ctx.fillStyle = '#eee'
  ctx.fillRect(4, this.height - 16, this.width * this.levelticker / TEN_SECONDS - 8, 12)

  if (this.flash)
  if (this.flash < 0.005) {
    this.flash = 0
  } else {
    this.camera.pos[0] += (Math.random() * 50 - 25) * this.flash
    this.camera.pos[1] += (Math.random() * 50 - 25) * this.flash
    this.flash *= 0.95
    ctx.globalAlpha = this.flash
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.globalAlpha = 1
  }

  this.score_display += (this.score - this.score_display) * 0.1
  if (this.score_display - this.score > -1) this.score_display = this.score
  if (this.score) this.drawScore(this.score_display)

  ctx.fillStyle = '#FFCFBF'
  ctx.strokeStyle = '#000'
  ctx.fillRect(mousex - 5, mousey - 5, 10, 10)
  ctx.strokeRect(mousex - 5, mousey - 5, 10, 10)
}

var numbers = require('dup')(10).map(function(n, i) {
  var img = new Image
  img.src = 'img/' + i + '.png'
  return img
})

Game.prototype.drawScore = function(n) {
  n = String(Math.floor(n))
  for (var i = 0; i < n.length; i += 1) {
    this.ctx.drawImage(numbers[n.charAt(i)], i * 14 + 12, 32)
  }
}

Game.prototype.enqueue = function(entity) {
  this.queue.push(entity)
}

Game.prototype.next = function(tick) {
  this.ticks.push(tick)
}
