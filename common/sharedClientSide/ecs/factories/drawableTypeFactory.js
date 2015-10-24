if(typeof BABYLON != 'undefined') {
	var scene = require('../../canvas').scene;
	var vespaSpriteManager = new BABYLON.SpriteManager("VespaMgr", "assets/vespa.png", 20, 512, scene);
}

var drawableTypeFactory = {
	vespaType: 'vespa',
	vespa: function(entity){
		console.log('created vespa');
		return new BABYLON.Sprite(entity.id + ' - sprite', vespaSpriteManager);
	}
};
module.exports = drawableTypeFactory;