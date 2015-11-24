var _ = require('lodash')

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
  self.translation = _.isArray(other.translation)
    ? [self.translation[0] + other.translation[0], self.translation[1] + other.translation[1]] : self.translation
  self.rotation = _.isNumber(other.rotation) ? self.rotation + other.rotation : self.rotation
  self.scale = _.isNumber(other.scale) ? self.scale * other.scale : self.scale
  self.rotmat = rotmat(self.rotation)
  return self
}

Transform.prototype.difference = function (other) {
  var self = this
  var dx = _.isArray(other.translation) ? other.translation[0] - self.translation[0] : 0
  var dy = _.isArray(other.translation) ? other.translation[1] - self.translation[1] : 0
  var dr = _.isNumber(other.rotation) ? other.rotation - self.rotation : 0
  var ds = _.isNumber(other.scale) ? other.scale - self.scale : 0
  return {
    translation: [dx, dy],
    rotation: dr,
    scale: ds
  }
}

Transform.prototype.distance = function (other) {
  var d = this.difference(other)
  return {
    translation: Math.sqrt(Math.pow(d.translation[0], 2) + Math.pow(d.translation[1], 2)),
    rotation: Math.abs(d.rotation),
    scale: Math.abs(d.scale)
  }
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

function rotmat (angle) {
  var rad = angle * Math.PI / 180
  return [[Math.cos(rad), -Math.sin(rad)], [Math.sin(rad), Math.cos(rad)]]
}
