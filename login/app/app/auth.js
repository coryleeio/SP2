var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var digestedServerSecret = SHA256(process.env.SHARED_SERVER_SECRET);
var Server = require('../app/models/server.js');
module.exports = {
    setServerTargetCookies: function(req, res) {
        Server.find({}).sort({load: 'ascending'}).exec(function(err, servers) {
            if(servers.length == 0) {
               return res.redirect('/server_down');
            }
            var host = servers[0].host;
            var port = servers[0].port;

            if(process.env.SHARED_SERVER_SECRET == null) {
                return null;
            }

            res.cookie('gameHost', host, { maxAge: 1200000});
            res.cookie('gamePort', port, { maxAge: 1200000});
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
        console.log("checking server key....");
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