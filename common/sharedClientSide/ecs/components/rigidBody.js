function RigidBody(rigidBodyType, parameters, velocity){
	this.parameters = parameters;
	this.rigidBodyType = rigidBodyType;
	this.velocity = velocity || {x:0, y:0};
}

module.exports = RigidBody;