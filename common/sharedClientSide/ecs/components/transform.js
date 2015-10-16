function Transform(position, angle){
	this.position = position || {x:0, y:0};
	this.angle = angle || 0;
}

module.exports = Transform;