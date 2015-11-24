# transformist

Simple transformations in the plane. A transform in two dimensions is defined here as a translation, a rotation, and a scale factor. This module lets you specify and compose these transforms and apply them to sets of points. Useful for 2D games and graphics.

## install

use npm

```
npm install transformist
```

## usage

#### `t = transform(opts)`

create a new transform

- `opts.translation` two-dimensional array in the form `[x,y]`
- `opts.scale` scale factor
- `opts.rotation` angle of rotation in degrees

#### `t.apply(points)`

Apply transformation to a list of `points` of the form `[[x, y], [x, y]...]`. Applies in order: scale, rotation, translation.

#### `t.invert(points)`

Undo a transformation on a list of `points` of the form `[[x, y], [x, y]...]`.  by applying the inverse transforms in order: translation, rotation, scale.

#### `t.compose(other)`

Compose this transform with a transform `other`, modifies in place. Translations and angles are added, scales are multiplied.

#### `t.difference(other)`

Compute difference between this transform and a transform `other`. Returns an object 

```javascript
{
	translation: [dx, dy]
	scale: ds
	rotation: dr
}
```

#### `t.distance(other)`

Compute distance between this transform and a transform `other`. Returns an object

```javascript
{
	translation: sqrt(dx^2 + dy^2)
	scale: abs(ds)
	rotation: abs(dr)
}
```
