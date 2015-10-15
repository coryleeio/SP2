var ships = {
	vespaType: 'vespa',
	vespa: {
		maxSpeed: 10,
		acceleration: 0.5,
		turnSpeed: 0.2
	}
}

// Derived properties
for(var key in ships) {
	var ship = ships[key];
	ship.negativeAcceleration = -1 * ship.acceleration;
	ship.negativeTurnSpeed = -1 * ship.turnSpeed;
}
module.exports = ships