module.exports.constructor = Drawable;
module.exports.name = 'drawable';
function Drawable(fn, arguements){
	this.fn = fn;
	this.arguements = arguements;
}