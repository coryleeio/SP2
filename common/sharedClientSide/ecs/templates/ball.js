var Entity = require('../entity');

var Drawable = require('../components/drawable').constructor;
var drawableName = require('../components/drawable').name

var RigidBody = require('../components/rigidBody').constructor;
var rigidBodyName = require('../components/rigidBody').name;

var Transform = require('../components/transform').constructor;
var transformName = require('../components/transform').name;

var PlayerInput = require('../components/PlayerInput').constructor;
var playerInputName = require('../components/playerInput').name;

function Ball(position, diameter, velocity) {
	var entity = new Entity();
	var d = diameter || 5;
	entity.addComponent(new Transform(position), transformName);
	entity.addComponent(new Drawable('sphere', {diameter: d}), drawableName);
	entity.addComponent(new RigidBody('circle', {radius: d/2}), rigidBodyName);
	entity.addComponent(new PlayerInput(), playerInputName);
	return entity;
}
module.exports = Ball;