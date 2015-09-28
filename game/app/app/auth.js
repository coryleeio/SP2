var CryptoJS = require("crypto-js");
module.exports = {
        onAuthorizeSuccess: function(data, accept){
          console.log('successful connection to socket.io');
          // If you use socket.io@1.X the callback looks different
          accept();
        },
        onAuthorizeFail: function(data, message, error, accept){
          console.log('failed connection to socket.io:', message);
          if(error)
            accept(new Error(message));
        }
};