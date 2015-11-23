var _ = require('lodash')
var path = require('path')
var test = require('tape')
var fuzzy = require('test-fuzzy-array')
var transform = require(path.resolve(__dirname + '/../index.js'))

function fuzzynest(t, a, b) {
  _.range(a.length).forEach( function(i) {
    fuzzy(t, 0.01)(a[i], b[i])
  })
  t.end()
}

test('construction', function (t) {
  var r = transform({position: [0, 0], scale: 1, angle: 1})
  t.deepEqual(r.position, [0, 0])
  t.equal(r.scale, 1)
  t.equal(r.angle, 1)
  t.end()
})

test('apply: translation', function (t) {
  var r = transform({position: [1, 2]})
  var a = r.apply([[0, 0], [0, 1]])
  var b = [[1, 2], [1, 3]]
  fuzzynest(t, a, b)
  
})

test('apply: scale', function (t) {
  var r = transform({scale: 2})
  var a = r.apply([[0, 0], [0, 1], [1, 0]])
  var b = [[0, 0], [0, 2], [2, 0]]
  fuzzynest(t, a, b)
})

test('apply: rotation', function (t) {
  var r = transform({angle: 90})
  var a = r.apply([[0, 0], [0, 1]])
  var b = [[0, 0], [-1, 1]]
  fuzzynest(t, a, b)
})