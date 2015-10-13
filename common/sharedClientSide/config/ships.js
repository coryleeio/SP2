var ships = {
	vespa: {
		maxSpeed: maxSpeed;
		acceleration: acceleration;
		turnSpeed: turnSpeed;
	}
}

ships.keys().forEach(function(key){
	var ship = ships[key];
	ship.negativeAcceleration = -1 * ship.acceleration;
	ship.negativeTurnSpeed = -1 * ship.turnSpeed;
});

module.exports = ships