function RigidBody(type, parameters, velocity){
	this.parameters = parameters;
	this.type = type;
	this.velocity = velocity || {x:0, y:0};
}

module.exports = RigidBody;