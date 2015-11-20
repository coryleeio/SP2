var RigidBody = require('../components/rigidBody');
var PlayerInput = require('../components/playerInput');
var Ship = require('../components/ship');
var Tranform = require('../components/transform');
var ShipTypeFactory = require('../factories/shipTypeFactory');

function ShipSystem(physicsSystem) {
	this.componentTypes = [Ship.name, RigidBody.name, PlayerInput.name, Tranform.name];
	this.matterBodiesByEntityId = physicsSystem.matterBodiesByEntityId; // By reference from physics system.
	this.Matter = physicsSystem.Matter;
}

function ceiling(Matter, vector, maximumMagnitude) {
	var Vector = Matter.Vector;
	var currentMagnitude = Vector.magnitude(vector);
	if(currentMagnitude > maximumMagnitude) {
		return Vector.mult(Vector.normalise(vector), maximumMagnitude);
	}
	return vector;
}

ShipSystem.prototype.step = function(entities, delta) {
	var Vector = this.Matter.Vector;
	entities.forEach(function(entity){
		var input = entity.components.playerInput;
		var ship = entity.components.ship;
		var shipStats = ShipTypeFactory[ship.shipType];
		var matterBody = this.matterBodiesByEntityId[entity.id];
		var rigidBody = entity.components.rigidBody;
		var transform = entity.components.transform;
		if(input) {

			if(input.right) {
				transform.angle = transform.angle + shipStats.negativeTurnSpeed;
			}
			else if(input.left) {
				transform.angle = transform.angle + shipStats.turnSpeed;
			}
			if(input.up) {

				// Set this in physics engine instead... should not modify physics engine state.
				// write to rigidbody, and let physicsSystem handle the engine.
				// this will allow additional systems to affect the velocity before assigning it also.
				var stepAddition = Vector.rotate({x: shipStats.acceleration, y: 0}, transform.angle);
				rigidBody.velocity = ceiling(this.Matter, Vector.add(rigidBody.velocity, stepAddition), shipStats.maxSpeed);
			}
			else if(input.down) {
				var stepAddition = Vector.rotate({x: shipStats.negativeAcceleration, y: 0}, transform.angle);
				rigidBody.velocity = ceiling(this.Matter, Vector.add(rigidBody.velocity, stepAddition), shipStats.maxSpeed);
			}
		}
	}, this);
}


module.exports = ShipSystem;