var rigidBodyName = require('../components/rigidBody').name;
var transformName = require('../components/transform').name;

function PhysicsSystem(Matter) {
	this.Matter = Matter;
	this.componentTypes = [rigidBodyName, transformName];
	this.engine = Matter.Engine.create();
	this.engine.world.gravity.y = 0;
	this.engine.world.gravity.x = 0;
	this.matterBodiesByEntityId = {};
	// this.Matter.Body.setVelocity(this.boxB, {x: 0, y: 0});
}

PhysicsSystem.prototype.onRegister = function(entity) {
	if(entity.components.rigidBody.type == "circle") {
		var transform = entity.components.transform;
		var parameters = entity.components.rigidBody.parameters;
		var matterBody = this.Matter.Bodies.circle(transform.position.x, transform.position.y, parameters.radius, {frictionAir: 0});
		this.matterBodiesByEntityId[entity.id] = matterBody;
		this.Matter.World.add(this.engine.world, [matterBody]);
		transform.position = matterBody.position; // by reference
	}
}

PhysicsSystem.prototype.onDeregister = function(entity) {
	this.matterBodiesByEntityId[entity.id] = null;
}

PhysicsSystem.prototype.step = function(entities, delta) {
	this.Matter.Events.trigger(this.engine, 'tick');
	this.Matter.Engine.update(this.engine, delta);
	this.Matter.Events.trigger(this.engine, 'afterTick');
	entities.forEach(function(entity){
		var rigidBody = entity.components.rigidBody;
		var transform = entity.components.transform;
		var matterBody = this.matterBodiesByEntityId[entity.id];
	}, this);
}

module.exports = PhysicsSystem;