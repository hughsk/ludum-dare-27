var bs = require('bindlestiff')

var controls = require('kb-controls')({
    '<left>': 'left'
  , 'A': 'left'

  , 'D': 'right'
  , '<right>': 'right'

  , 'W': 'jump'
  , '<up>': 'jump'
  , '<space>': 'jump'
})

module.exports = bs.component('controllable')
  .on('init', function() {
    this.controlling = true
    this.controls = controls
  })
