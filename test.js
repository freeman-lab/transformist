var mat3 = require('gl-mat3')
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

test('compose: translation', function (t) {
  var r1 = transform({translation: [1, 0]})
  var r2 = transform({translation: [1, 2]})
  allclose(t)(r1.compose(r2).translation, [2, 2])
  t.end()
})

test('compose: rotation', function (t) {
  var r1 = transform({rotation: 20})
  var r2 = transform({rotation: 30})
  allclose(t)(r1.compose(r2).rotation, 50)
  t.end()
})

test('compose: scale', function (t) {
  var r1 = transform({scale: 2})
  var r2 = transform({scale: 3})
  allclose(t)(r1.compose(r2).scale, 6)
  t.end()
})

test('compose: all', function (t) {
  var r1 = transform({translation: [1, 0], rotation: 20, scale: 2})
  var r2 = transform({translation: [1, 2], rotation: 30, scale: 3})
  var r3 = r1.compose(r2)
  allclose(t)(r3.translation, [2, 2])
  allclose(t)(r3.rotation, 50)
  allclose(t)(r3.scale, 6)
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

test('apply: all', function (t) {
  var r = transform({translation: [-1, 0], rotation: 90, scale: 2})
  var a = r.apply([[0, 0], [0, 1]])
  var b = [[-1, 0], [-3, 0]]
  allclose(t)(a, b)
  t.end()
})

test('apply: translation singleton', function (t) {
  var r = transform({translation: [1, 2]})
  var a = r.apply([0, 0])
  var b = [1, 2]
  allclose(t)(a, b)
  t.end()
})

test('invert: translation', function (t) {
  var r = transform({translation: [1, 2]})
  var a = r.invert([[0, 0], [0, 1]])
  var b = [[-1, -2], [-1, -1]]
  allclose(t)(a, b)
  t.end()
})

test('invert: scale', function (t) {
  var r = transform({scale: 2})
  var a = r.invert([[0, 0], [0, 2], [2, 0]])
  var b = [[0, 0], [0, 1], [1, 0]]
  allclose(t)(a, b)
  t.end()
})

test('invert: rotation', function (t) {
  var r = transform({rotation: 90})
  var a = r.invert([[0, 0], [0, 1]])
  var b = [[0, 0], [1, 0]]
  allclose(t)(a, b)
  t.end()
})

test('invert: all', function (t) {
  var r = transform({translation: [1, 0], rotation: 90, scale: 2})
  var a = r.invert([[0, 0], [0, 1]])
  var b = [[0, 0.5], [0.5, 0.5]]
  allclose(t)(a, b)
  t.end()
})

test('invert: translation singleton', function (t) {
  var r = transform({translation: [1, 2]})
  var a = r.invert([0, 0])
  var b = [-1, -2]
  allclose(t)(a, b)
  t.end()
})

test('invert: roundtrip', function (t) {
  var r = transform({translation: [1, 0], rotation: 90, scale: 2})
  var a = [[0, 0], [0, 1], [1, 0]]
  allclose(t)(a, r.invert(r.apply(a)))
  t.end()
})

test('invert: roundtrip backwards', function (t) {
  var r = transform({translation: [1, 0], rotation: 90, scale: 2})
  var a = [[0, 0], [0, 1], [1, 0]]
  allclose(t)(a, r.apply(r.invert(a)))
  t.end()
})

test('update', function (t) {
  var r = transform({translation: [1, 2]})
  var a = r.apply([0, 0])
  var b = [1, 2]
  allclose(t)(a, b)
  r.translation = [1, 3]
  var c = r.apply([0, 0])
  var d = [1, 3]
  allclose(t)(c, d)
  t.end()
})

test('mat: translation', function (t) {
  var r = transform({translation: [1, 2]})
  allclose(t)(_.values(r.tomat()), [1, 0, 0, 0, 1, 0, 1, 2, 1])
  t.end()
})

test('mat: rotation', function (t) {
  var r = transform({rotation: 180})
  allclose(t)(_.values(r.tomat()), [-1, 0, 0, 0, -1, 0, 0, 0, 1])
  t.end()
})

test('mat: scale', function (t) {
  var r = transform({scale: 3})
  allclose(t)(_.values(r.tomat()), [3, 0, 0, 0, 3, 0, 0, 0, 1])
  t.end()
})

test('mat: combined', function (t) {
  var r = transform({translation: [1, 2], rotation: 180, scale: 3})
  allclose(t)(_.values(r.tomat()), [-3, 0, 0, 0, -3, 0, 1, 2, 1])
  t.end()
})