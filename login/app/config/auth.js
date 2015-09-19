
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
        var server_shared_secret = process.env.SHARED_SERVER_SECRET;
        if(server_shared_secret == null) {
            res.send(500);
            return;
        }

        if(req.body['server_shared_secret'] != null 
            && req.body['server_shared_secret'] === server_shared_secret){
            return next();
        }   
        res.send(401);
    }
};