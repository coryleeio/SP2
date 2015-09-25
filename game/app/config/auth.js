var CryptoJS = require("crypto-js");
module.exports = {
    validateLoginToken: function(loginToken) {
        if(process.env.SHARED_SERVER_SECRET == null || loginToken == null) {
            return false;
        }
        var key = process.env.SHARED_SERVER_SECRET;
        var bytes  = CryptoJS.AES.decrypt(loginToken.toString(), key);
        var login = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        var tokenDate = new Date(login.expiry);
        var currentDate = new Date();

        var correct_host = login.host != null && login.host == process.env.HOST &&
        	login.port != null && login.port == process.env.PORT;
        var providedExpiration = login.expiry != null;
        var isExpired = tokenDate > currentDate;

        if( correct_host && providedExpiration && !isExpired) {
        	console.log('Authentication successful for ' + login.user_id);
        	return true;
        }
		if(!correct_host) {
			console.log('User: ' + login.user_id + 'Attempting to log into wrong host.');
		}
		if(!isExpired) {
			console.log('User: ' + login.user_id + 'Expiry not specified.');
		}
		if(!dateCheck) {
			console.log('User: ' + login.user_id + 'Login token has expired!');
		}
        return false;
    }
};