var _ = require('lodash')
var test = require('tape')
var allclose = require('test-allclose')
var transform = require('./index.js')

test('construction', function (t) {
  var r = transform({translation: [0, 0], scale: 1, rotation: 1})
  t.deepEqual(r.translation, [0, 0])
  t.equal(r.scale, 1)
  t.equal(r.rotation, 1)
  t.end()
})

test('apply: translation', function (t) {
  var r = transform({translation: [1, 2]})
  var a = r.apply([[0, 0], [0, 1]])
  var b = [[1, 2], [1, 3]]
  allclose(t)(a, b)
  t.end()
})

test('apply: scale', function (t) {
  var r = transform({scale: 2})
  var a = r.apply([[0, 0], [0, 1], [1, 0]])
  var b = [[0, 0], [0, 2], [2, 0]]
  allclose(t)(a, b)
  t.end()
})

test('apply: rotation', function (t) {
  var r = transform({rotation: 90})
  var a = r.apply([[0, 0], [0, 1]])
  var b = [[0, 0], [-1, 0]]
  allclose(t)(a, b)
  t.end()
})