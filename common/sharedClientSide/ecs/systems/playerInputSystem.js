
var PlayerInput = require('../components/playerInput');


function PlayerInputSystem(world) {
	this.playerControlledEntityId = null;
	this.componentTypes = [PlayerInput.name];
	this.playerInputObject = null;


	var keyListener = function(event) {
			if(this.playerControlledEntityId != null) {
				var entity = world.entitiesById[this.playerControlledEntityId];
				var playerInput = entity.components.playerInput;
				var isDown = event.type == 'keydown';
				if(event.keyCode === 87)
				{
					playerInput.up = isDown;
				}
				else if(event.keyCode === 83)
				{
					playerInput.down = isDown;
				}

				else if(event.keyCode === 65)
				{
					playerInput.left = isDown;
				}

				else if(event.keyCode === 68)
				{
					playerInput.right = isDown;
				}

				this.playerInputObject = playerInput;
			}
	}.bind(this);


	window.addEventListener("keydown", keyListener);
	window.addEventListener("keyup", keyListener);
}

PlayerInputSystem.prototype.setPlayerControlledEntity = function(entityId) {
	console.log("Taking control of entity: ", entityId);
	this.playerControlledEntityId = entityId;
}

PlayerInputSystem.prototype.getPlayerInput = function() {
	return this.playerInputObject;
}

module.exports = PlayerInputSystem;