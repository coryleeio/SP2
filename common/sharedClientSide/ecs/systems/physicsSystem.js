var physicsBody = require('../components/physicsBody').name;
function PhysicsSystem(Matter) {
	this.Matter = Matter;
	this.componentTypes = [physicsBody];
	this.engine = Matter.Engine.create();

	// this.boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
	// this.boxB = Matter.Bodies.rectangle(450, 50, 80, 80);

	// this.ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
	// this.Matter.World.add(this.engine.world, [this.boxA, this.boxB, this.ground]);
	// this.Matter.Body.setVelocity(this.boxA, {x: 10, y: 15});
	// this.Matter.Body.setVelocity(this.boxB, {x: 0, y: 0});

}

PhysicsSystem.prototype.step = function(entity, delta) {
	this.Matter.Events.trigger(this.engine, 'tick');
	this.Matter.Engine.update(this.engine, delta);
	this.Matter.Events.trigger(this.engine, 'afterTick');
	
	// console.log('boxA', this.boxA.position);
	// console.log('boxB', this.boxB.position);
}


module.exports = PhysicsSystem;