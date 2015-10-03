module.exports = function(schema){
	schema.pre('validate', function(next){
	    now = new Date();
	    this.updated_at = now;
	    if( !this.created_at ) {
	        this.created_at = now;
	    }
	    next();
	})
};