var _ = require('lodash')

module.exports = Transform

function Transform(opts) {
  if (!(this instanceof Transform)) {
    return new Transform(opts)
  }
  var self = this
  opts = opts || {}
  this.position = _.isArray(opts.position) ? opts.position : [0, 0]
  this.scale = _.isNumber(opts.scale) ? opts.scale : 1
  this.angle = _.isNumber(opts.angle) ? opts.angle : 0
  this.rotation = self.rotmat(self.angle)
}

Transform.prototype.compose = function(other) {
  var self = this
  self.position = _.isArray(other.position)
    ? [self.position[0] + other.position[0], self.position[1] + other.position[1]] : self.position
  self.angle = _.isNumber(other.angle) ? self.angle + other.angle : self.angle
  self.scale = _.isNumber(other.scale) ? self.scale * other.scale : self.scale
  self.rotation = self.rotmat(self.angle)
}

Transform.prototype.difference = function(other) {
  var self = this
  var dx = _.isArray(other.position) ? other.position[0] - self.position[0] : 0
  var dy = _.isArray(other.position) ? other.position[1] - self.position[1] : 0
  var da = _.isNumber(other.angle) ? other.angle - self.angle : 0
  var ds = _.isNumber(other.scale) ? other.scale - self.scale : 0
  return {
    position: [dx, dy],
    angle: da,
    scale: ds
  }
}

Transform.prototype.distance = function(other) {
  var d = this.difference(other)
  return {
    position: Math.sqrt(Math.pow(d.position[0], 2) + Math.pow(d.position[1], 2)),
    angle: Math.abs(d.angle),
    scale: Math.abs(d.scale)
  }
}

Transform.prototype.apply = function(points) {
  var self = this
  points = points.map( function(xy) {
    return [xy[0] * self.scale, xy[1] * self.scale]
  })
  points = points.map( function(xy) {
    return [
      xy[0] * self.rotation[0][0] + xy[1] * self.rotation[0][1],
      xy[0] * self.rotation[1][0] + xy[1] * self.rotation[1][1],
    ]
  })
  points = points.map(function(xy) {
    return [xy[0] + self.position[0], xy[1] + self.position[1]]
  })
  return points
}

Transform.prototype.invert = function(points) {
  var self = this
  points = points.map(function (xy) {
    return [xy[0] - self.position[0], xy[1] - self.position[1]]
  })
  points = points.map(function (xy) {
    return [
      xy[0] * self.rotation[0][0] - xy[1] * self.rotation[0][1],
      -xy[0] * self.rotation[1][0] + xy[1] * self.rotation[1][1]
    ]
  })
  points = points.map(function (xy) {
    return [xy[0] / self.scale, xy[1] / self.scale]
  })
  return points
}

Transform.prototype.rotmat = function(angle) {
  var rad = angle * Math.PI / 180
  return [[Math.cos(rad), -Math.sin(rad)], [Math.sin(rad), Math.cos(rad)]]
}