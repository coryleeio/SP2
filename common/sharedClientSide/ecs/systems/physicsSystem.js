var RigidBody = require('../components/rigidBody';
var Transform = require('../components/transform');

function PhysicsSystem(Matter) {
	this.Matter = Matter;
	this.componentTypes = [RigidBody.name, Transform.name];
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
	var Body = this.Matter.Body;
	entities.forEach(function(entity){
		var rigidBody = entity.components.rigidBody;
		var transform = entity.components.transform;
		var matterBody = this.matterBodiesByEntityId[entity.id];


		// Write state to the physics simulation.  Other systems should probably run before this one, since 
		// assigning to it affects the simulation.

		Body.setVelocity(matterBody, rigidBody.velocity);


		XXXXX
		// this is angle relative to current rotation, 
		// but the angle on transform is relative to X-axis.
		// need to fix this before rotating.
		Body.rotate(matterBody, transform.angle.RELATIVE_TO_X_AXIS); 
	}, this);
}

module.exports = PhysicsSystem;