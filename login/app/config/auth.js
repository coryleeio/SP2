var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var digestedServerSecret = SHA256(process.env.SHARED_SERVER_SECRET);
module.exports = {
    generateLoginToken: function(user_id, host, port) {
        if(process.env.SHARED_SERVER_SECRET == null) {
            return null;
        }

        var key = process.env.SHARED_SERVER_SECRET;
        var expiry = new Date();
        expiry = expiry.setMinutes(expiry.getMinutes() + 5);
        message = JSON.stringify({
            user_id: user_id,
            user_display: 'ffff',
            expiry: expiry,
            host: host,
            port: port
        });
        var ciphertext = AES.encrypt(message, key);
        return ciphertext.toString();
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