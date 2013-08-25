module.exports = Spawner

function Spawner(game) {
  if (!(this instanceof Spawner)) return new Spawner(game)

  var Enemy = require('../components/enemy')(2, 2, 0, 0).tag('spawned')
  var b2Vec2 = require('box2dweb-commonjs').Box2D.Common.Math.b2Vec2

  game.field.grid.on('created', function(chunk) {
    var x = chunk.position[0] * chunk.shape[0]
    var y = chunk.position[1] * chunk.shape[1]
    for (var i = 0; i < 10; i += 1) {
      var enemy = new Enemy
      game.add(enemy)
      enemy.body.SetPosition(new b2Vec2(Math.random() * 30 + x, Math.random() * 30 + y))
    }
  })
  game.field.grid.on('removed', function(chunk) {
    var cx = chunk.position[0] * chunk.shape[0]
    var cy = chunk.position[1] * chunk.shape[1]
    var spawned = game.find('spawned')
    var n = 0
    for (var i = 0; i < spawned.length; i += 1) {
      var b = spawned[i].body
      var x = b.m_xf.position.x
      var y = b.m_xf.position.y
      if (x > cx && y > cy && x < cx+30 && y < cy+30) {
        n += 1
        spawned[i].flagged = true
      }
    }
    console.log(n, 'removed')
  })
}
