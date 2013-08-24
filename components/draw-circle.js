var bs = require('bindlestiff')

module.exports = function drawCircle(r, color) {
  var r2 = (r = +r|0 || 15) * 2

  return bs.component()
    .needs('attached')
    .needs('body')
    .on('draw', function(ctx) {
      ctx.fillStyle = color
      ctx.fillRect(
          this.body.m_xf.position.x * 30 - this.game.camera.pos[0] - r
        , this.body.m_xf.position.y * 30 - this.game.camera.pos[1] - r
        , r2
        , r2
      )
    })
}
