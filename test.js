var _ = require('lodash')
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
  var r2 = transform({translation: [0, 1]})
  var r3 = r1.compose(r2)
  allclose(t)(r3.translation, [1, 1])
  t.end()
})

test('compose: rotation', function (t) {
  var r1 = transform({rotation: 45})
  var r2 = transform({rotation: 45})
  var r3 = r1.compose(r2)
  allclose(t)(r3.rotation, 90)
  t.end()
})

test('compose: scale', function (t) {
  var r1 = transform({scale: 2})
  var r2 = transform({scale: 3})
  var r3 = r1.compose(r2)
  allclose(t)(r3.scale, 6)
  t.end()
})

test('compose: all', function (t) {
  var r1 = transform({translation: [1, 0], rotation: 90})
  var r2 = transform({translation: [0, 1], rotation: 90})
  var r3 = r1.compose(r2)
  allclose(t)(r3.translation, [0, 2])
  allclose(t)(r3.rotation, 180)
  allclose(t)(r3.apply([0, 1]), [0, 1])
  t.end()
})

test('compose: matrices', function (t) {
  var r1 = transform({translation: [1, 0], rotation: 90})
  var r2 = transform({translation: [0, 1], rotation: 90})
  var m1 = r1.tomat()
  var m2 = r2.tomat()
  var r3 = r1.compose(r2)
  var m3a = r3.tomat()
  var m3b = mat3.multiply(mat3.create(), m2, m1)
  allclose(t)(_.values(m3a), _.values(m3b))
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
