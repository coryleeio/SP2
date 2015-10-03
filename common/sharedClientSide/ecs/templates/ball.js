var Entity = require('../entity');

function Ball() {
	Entity.apply(this, arguements);
	console.log("Ball created");
	return this;
}

i need to inherit from entity.
Ball.prototype = inherit(Entity.prototype);
Ball.prototype.templateName = 'Ball';

module.exports = Ball;