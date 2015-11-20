# transformist

really simple two-dimensional transformations. lets you specify and compose translations, scalings, and/or rotations, and apply them to sets of points.

## API

#### `t = transform(opts)`

create a new transform

**opts**
- `position` two-dimensional array in the form `[x,y]`
- `scale` scale factor
- `angle` angle in degrees

#### `t.apply(points)`

Apply transformation to a list of `points` of the form `[[x, y], [x, y]...]`. Applies in order: scale, rotation, translation.

#### `t.invert(points)`

Undoes a transformation on a list of `points` of the form `[[x, y], [x, y]...]`.  by applying the inverse transforms in order: translation, rotation, scale.

#### `t.compose(other)`

Compose this transform with a transform `other`, modifies in place. Positions and angles are added, scales are multiplied.

#### `t.difference(other)`

Compute difference between this transform and a transform `other`. Returns an object 

```javascript
{
	position: [dx, dy]
	scale: ds
	angle: da
}
```

#### `t.distance(other)`

Compute distance between this transform and a transform `other`. Returns an object

```javascript
{
	position: sqrt(dx^2 + dy^2)
	scale: abs(ds)
	angle: abs(da)
}
```
