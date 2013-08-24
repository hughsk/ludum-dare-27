var Manager = require('bindlestiff/manager')
var inherits = require('inherits')
var trap = require('pointer-trap')
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

  this.gravity = new b2Vec2(0, 50)
  this.world = new b2World(this.gravity, true)

  this.field = field(this)

  this.pointer = trap(this.canvas)
  this.mouse = this.pointer.pos
  this.mouse.x = +this.mouse.x|0
  this.mouse.y = +this.mouse.y|0
}
inherits(Game, Manager)

Game.prototype.tick = function() {
  var l = this.instances.length
  for (var i = 0; i < l; i += 1)
    this.instances[i].trigger('tick')
}

Game.prototype.draw = function() {
  this.ctx.fillStyle = '#fff'
  this.ctx.fillRect(0, 0, this.width, this.height)

  var l = this.instances.length
  for (var i = 0; i < l; i += 1)
    this.instances[i].trigger('draw')
}
