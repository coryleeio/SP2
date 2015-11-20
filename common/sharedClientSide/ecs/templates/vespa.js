var Entity      = require('../entity');
var Transform   = require('../components/transform');
var RigidBody   = require('../components/rigidBody');
var PlayerInput = require('../components/playerInput');
var Drawable    = require('../components/drawable');
var Ship        = require('../components/ship');
var RigidBodyTypeFactory = require('../factories/rigidBodyTypeFactory');
var DrawableTypeFactory  = require('../factories/drawableTypeFactory');
var ShipTypeFactory      = require('../factories/shipTypeFactory');

function Vespa(position){
	var entity = new Entity();
	entity.addComponent(new Transform(position), Transform.name);
	entity.addComponent(new RigidBody(RigidBodyTypeFactory.circleType, {radius: .47}), RigidBody.name);
	entity.addComponent(new PlayerInput(), PlayerInput.name);
	entity.addComponent(new Drawable(DrawableTypeFactory.vespaType), Drawable.name);
	entity.addComponent(new Ship(ShipTypeFactory.vespaType), Ship.name);
	return entity;
}

module.exports = Vespa;