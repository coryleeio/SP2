var gameConstants = require('./_sharedClientSide/config/gameConstants');
var previousTick = Date.now();
var delta;
var now;

module.exports = function(socket, entityIdToControl, world) {
	now = Date.now();
	delta = (now - previousTick) / 1000;
	if (previousTick + gameConstants.stepDelta <= now) {
		previousTick = now;
		world.step(delta);
	}
	world.update(delta);
}