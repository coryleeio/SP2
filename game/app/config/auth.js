var CryptoJS = require("crypto-js");
module.exports = {
    validateLoginToken: function(loginToken) {
        if(process.env.SHARED_SERVER_SECRET == null || loginToken == null) {
            return false;
        }
        var key = process.env.SHARED_SERVER_SECRET;
        var bytes  = CryptoJS.AES.decrypt(loginToken.toString(), key);
        var login = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        if(login.user_id == null) {
        	console.log('got request without a user id??');
        	console.log(JSON.stringify(login));
        	return false;
        }

        if(login.user_display == null) {
        	console.log('user: ' + login.user_id + 'logging in without display name.');
        	return false;
        }

        if((login.host == null || login.host != process.env.HOST) || 
        	(login.port == null || login.port != process.env.PORT)) {
        	console.log('user: ' + login.user_id + ' attempting to log into wrong host.');
        	return false;
        }

        if(login.expiry == null) {
        	console.log('user: ' + login.user_id + 'expiry not specified.');
        	return false;
        }

        var tokenDate = new Date(login.expiry);
        var currentDate = new Date();
        console.log(tokenDate);
        console.log(currentDate);
        console.log(tokenDate > currentDate);
        if(tokenDate < currentDate) {
        	console.log('user: ' + login.user_id + 'Login token has expired!');
        	return false;
        }
        return true;
    }
};