module.exports = {
        onAuthorizeSuccess: function(data, accept){
          console.log('successful connection to socket.io');
          accept();
        },
        onAuthorizeFail: function(data, message, error, accept){
          // Still accept connection if user isn't authenticated.
          // Authentication is not mandatory for play-as-guest functionality.
          console.log('successful connection to socket.io');
          accept();
        }
};