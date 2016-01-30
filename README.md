# transformist

Simple transformations in the plane. A transform in two dimensions is defined here as a translation, a rotation, and a scaling. This module lets you specify this kind of transform and apply it, or its inverse, to one or more points. Methods are also provided for comparing and composing transforms. Useful for 2D games and graphics.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## install

use npm

```
npm install transformist
```

## examples

```javascript
var transform = require('transformist')
```

```javascript
var t = transform({translation: [1, 2], scale: 2})

t.apply([1, 1])
> [3, 4]
```

```javascript
var t = transform({rotation: 90, scale: 2})

t.apply([[0, 0], [0, 1]])
> [[0, 0], [-2, 0]]
```

## usage

#### `t = transform(opts)`

create a new transform

- `opts.translation` two-dimensional array in the form `[x, y]`, default `[0, 0]`
- `opts.rotation` angle of rotation in degrees, default `0`
- `opts.scale` scale factor, default `1`

#### `t.apply(points)`

Apply transformation to one or more `points` of the form `[[x, y], [x, y]...]` or `[x, y]`. Applies in order: scale, rotation, translation.

#### `t.invert(points)`

Undo a transformation on one or more `points` of the form `[[x, y], [x, y]...]` or `[x, y]`. Applies the inverse transform in order: translation, rotation, scale.

#### `t.compose(other)`

Compose this transform with a transform `other`, modifies in place. Translations and angles are added, scales are multiplied.

#### `t.difference(other)`

Compute difference between this transform and a transform `other`. Returns an object 

```javascript
{
	translation: [dx, dy]
	rotation: dr
	scale: ds
}
```

#### `t.distance(other)`

Compute distance between this transform and a transform `other`. Returns an object

```javascript
{
	translation: sqrt(dx^2 + dy^2)
	rotation: abs(dr)
	scale: abs(ds)
}
```
#### `t.tomat()`
Return a [`mat3`](https://github.com/stackgl/gl-mat3) representation of the transform.
