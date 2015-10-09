var Entity = require('../entity');

var Drawable = require('../components/drawable').constructor;
var drawableName = require('../components/drawable').name

var RigidBody = require('../components/rigidBody').constructor;
var rigidBodyName = require('../components/rigidBody').name;

var Transform = require('../components/transform').constructor;
var transformName = require('../components/transform').name;

function Ball(position, diameter) {
	var entity = new Entity();
	var d = diameter || 5;
	entity.addComponent(new Transform(position), transformName);
	entity.addComponent(new Drawable('sphere', {diameter: d}), drawableName);
	entity.addComponent(new RigidBody('circle', {radius: d/2}), rigidBodyName);
	return entity;
}
module.exports = Ball;