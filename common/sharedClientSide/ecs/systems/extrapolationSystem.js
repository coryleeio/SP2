var PlayerInput = require('../components/playerInput');
var Ship = require('../components/ship');
var Tranform = require('../components/transform');
var ShipTypeFactory = require('../factories/shipTypeFactory');

function ExtrapolationSystem() {
	this.componentTypes = [Ship.name, PlayerInput.name, Tranform.name];
}

ExtrapolationSystem.prototype.step = function(entities, delta) {
	entities.forEach(function(entity){
		var input = entity.components.playerInput;
		var ship = entity.components.ship;
		var shipStats = ShipTypeFactory[ship.shipType];
		var transform = entity.components.transform;
		if(input) {

			if(input.right) {
				transform.angle = transform.angle + shipStats.negativeTurnSpeed;
			}
			else if(input.left) {
				transform.angle = transform.angle + shipStats.turnSpeed;
			}
		}
	}, this);
}


module.exports = ExtrapolationSystem;