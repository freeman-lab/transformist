var _ = require('lodash')
var mat3 = require('gl-mat3')

module.exports = Transform

function Transform (opts) {
  if (!(this instanceof Transform)) {
    return new Transform(opts)
  }
  var self = this
  opts = opts || {}
  this.translation = _.isArray(opts.translation) ? opts.translation : [0, 0]
  this.scale = _.isNumber(opts.scale) ? opts.scale : 1
  this.rotation = _.isNumber(opts.rotation) ? opts.rotation : 0
  this.rotmat = rotmat(self.rotation)
}

Transform.prototype.compose = function (other) {
  var self = this
  self.translation = Transform({rotation: other.rotation, scale: other.scale}).apply(self.translation)
  self.translation = _.isArray(other.translation)
    ? [self.translation[0] + other.translation[0], self.translation[1] + other.translation[1]]
    : self.translation
  self.rotation = _.isNumber(other.rotation) ? self.rotation + other.rotation : self.rotation
  self.scale = _.isNumber(other.scale) ? self.scale * other.scale : self.scale
  self.rotmat = rotmat(self.rotation)
  return self
}

Transform.prototype.apply = function (points) {
  if (!_.isArray(points)) throw Error('Points must be an array')
  if (!_.isArray(points[0])) {
    var cleanup = true
    points = [points]
  }
  var self = this

  points = points.map(function (xy) {
    return [xy[0] * self.scale, xy[1] * self.scale]
  })
  points = points.map(function (xy) {
    return [
      xy[0] * self.rotmat[0][0] + xy[1] * self.rotmat[0][1],
      xy[0] * self.rotmat[1][0] + xy[1] * self.rotmat[1][1]
    ]
  })
  points = points.map(function (xy) {
    return [xy[0] + self.translation[0], xy[1] + self.translation[1]]
  })
  return cleanup ? points[0] : points
}

Transform.prototype.invert = function (points) {
  if (!_.isArray(points)) throw Error('Points must be an array')
  if (!_.isArray(points[0])) {
    var cleanup = true
    points = [points]
  }
  var self = this

  points = points.map(function (xy) {
    return [xy[0] - self.translation[0], xy[1] - self.translation[1]]
  })
  points = points.map(function (xy) {
    return [
      xy[0] * self.rotmat[0][0] - xy[1] * self.rotmat[0][1],
      -xy[0] * self.rotmat[1][0] + xy[1] * self.rotmat[1][1]
    ]
  })
  points = points.map(function (xy) {
    return [xy[0] / self.scale, xy[1] / self.scale]
  })
  return cleanup ? points[0] : points
}

Transform.prototype.tomat = function () {
  var self = this
  var mat = mat3.create()
  mat3.translate(mat, mat, self.translation)
  mat3.rotate(mat, mat, self.rotation * Math.PI / 180)
  mat3.scale(mat, mat, [self.scale, self.scale])
  return mat
}

function rotmat (angle) {
  var rad = angle * Math.PI / 180
  return [[Math.cos(rad), -Math.sin(rad)], [Math.sin(rad), Math.cos(rad)]]
}
