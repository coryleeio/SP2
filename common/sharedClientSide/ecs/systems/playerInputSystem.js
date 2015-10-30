
var PlayerInput = require('../components/playerInput');


function PlayerInputSystem(world) {
	this.playerControlledEntityId = null;
	this.componentTypes = [PlayerInput.name];
	this.playerInputObject = null;

	window.addEventListener("keydown", function(event){
		console.log(this.constructor.name);
		if(this.playerControlledEntityId != null) {
			var entity = world.entitiesById[this.playerControlledEntityId];
			var playerInput = entity.components.playerInput;
			if(event.keyCode === 87)
			{
				console.log('pushing up');
				playerInput.up = true;
			}
			if(event.keyCode === 83)
			{
				console.log('pushing down');
				playerInput.down = true;
			}

			if(event.keyCode === 65)
			{
				console.log('pushing left');
				playerInput.left = true;
			}

			if(event.keyCode === 68)
			{
				console.log('pushing right');
				playerInput.right = true;
			}
			this.playerInputObject = playerInput;
		}
	}.bind(this));
}

PlayerInputSystem.prototype.setPlayerControlledEntity = function(entityId) {
	console.log("Taking control of entity: ", entityId);
	this.playerControlledEntityId = entityId;
}

PlayerInputSystem.prototype.getPlayerInput = function() {
	return this.playerInputObject;
}

module.exports = PlayerInputSystem;