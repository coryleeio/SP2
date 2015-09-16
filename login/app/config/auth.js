
var gameServerConfig = require('./game_server_config.js');
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
        if(gameServerConfig['server_key'] == null) {
            res.send(500);
            return;
        }

        if(req.body['server_key'] != null 
            && req.body['server_key'] === gameServerConfig['server_key']){
            return next();
        }   
        res.send(401);
    }
};