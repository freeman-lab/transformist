var path = require('path')
var test = require('tape')
var transform = require(path.resolve(__dirname + '/../index.js'))

test('construction', function (t) {
  r = transform({position: [0, 0], scale: 1, angle: 1})
  t.deepEqual(r.position, [0, 0])
  t.equal(r.scale, 1)
  t.equal(r.angle, 1)
  t.end()
})