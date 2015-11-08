var ships = {
	vespaType: 'vespa',
	vespa: {
		maxSpeed: 0.125,
		acceleration: 0.025,
		turnSpeed: 0.15
	}
}

// Derived properties
for(var key in ships) {
	var ship = ships[key];
	ship.negativeAcceleration = -1 * ship.acceleration;
	ship.negativeTurnSpeed = -1 * ship.turnSpeed;
}
module.exports = ships