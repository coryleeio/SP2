var forge = require('node-forge');
var md = forge.md.sha256.create();
md.update(process.env.SHARED_SERVER_SECRET);
var digestedServerSecret = md.digest().toHex();

module.exports = {
    isLoggedIn: function(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('/');
    },
    serverKeyIsValid: function(req, res, next) {
        if(process.env.SHARED_SERVER_SECRET == null) {
            res.send(500);
            return;
        }

        if(req.body['key'] != null 
            && req.body['key'] === digestedServerSecret){
            return next();
        }   
        res.send(401);
    }
};