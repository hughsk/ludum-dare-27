var Box2D = require('box2dweb-commonjs')
var bs = require('bindlestiff')

module.exports = createBody

function createBody(body, fixture) {
  return bs.component('body')
    .needs('physical')
    .on('init', function() {
      this.body = this.world.CreateBody(body(this.world))
      this.fixture = this.body.CreateFixture(fixture(this.body, this.world))
      console.log(this.body.m_userData)
    })
}
