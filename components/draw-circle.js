var bs = require('bindlestiff')

module.exports = function drawCircle(r, c) {
  var r2 = (r = (+r|0) || 15) * 2
  var tau = Math.PI * 2

  return bs.component()
    .needs('attached')
    .needs('body')
    .on('draw', function(ctx) {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(
          this.body.m_xf.position.x * 30 - this.game.camera.pos[0]
        , this.body.m_xf.position.y * 30 - this.game.camera.pos[1]
        , r
        , 0
        , tau
        , true
      )
      ctx.closePath()
      ctx.fill()
    })
}
