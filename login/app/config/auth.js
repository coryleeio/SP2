var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var digestedServerSecret = SHA256(process.env.SHARED_SERVER_SECRET);
var Server = require('../app/models/server.js');
module.exports = {
    googleAuth: {
        'clientID'      : process.env.GOOGLE_CLIENT_ID,
        'clientSecret'  : process.env.GOOGLE_CLIENT_SECRET,
        'callbackURL'   : process.env.GOOGLE_CALLBACK_URL
    },
    authorizeForServer: function(req, res) {
        Server.find({}).sort({load: 'ascending'}).exec(function(err, servers) {
            if(servers.length == 0) {
               return res.redirect('/server_down');
            }
            var host = servers[0].host;
            var port = servers[0].port;

            if(process.env.SHARED_SERVER_SECRET == null) {
                return null;
            }

            var key = process.env.SHARED_SERVER_SECRET;
            var expiry = new Date();
            expiry = expiry.setMinutes(expiry.getMinutes() + 15);
            var user = {
                user_display: 'Space Cadet',
                expiry: expiry,
                host: host,
                port: port
            }
            if(req.user != null) { // User might be anon.
                user.user_id = req.user.id
            }

            message = JSON.stringify();
            var ciphertext = AES.encrypt(message, key);
            var loginToken = ciphertext.toString();
            res.cookie('loginToken', loginToken, { maxAge: 1200000, httpOnly: true });
            res.cookie('gameHost', host, { maxAge: 1200000, httpOnly: true });
            res.cookie('gamePort', port, { maxAge: 1200000, httpOnly: true });
            res.send(204);
        });
    },
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
        if(req.body.key != null 
            && req.body.key == digestedServerSecret){
            return next();
        }   
        res.send(401);
    }
};