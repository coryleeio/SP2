var rigidBodyTypeFactory = {
	circleType: 'circle',
    circle: function(entity, Matter) {
    	var transform = entity.components.transform;
    	var parameters = entity.components.rigidBody.parameters;
    	var matterBody = Matter.Bodies.circle(transform.position.x, transform.position.y, parameters.radius, {frictionAir: 0});
    	return matterBody;
    }
};
module.exports = rigidBodyTypeFactory;