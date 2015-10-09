module.exports.constructor = RigidBody;
module.exports.name = 'rigidBody';
function RigidBody(type, parameters){
	this.parameters = parameters;
	this.type = type;
}