(function(exports){

   // 

   exports.test = function(){
        return 'hello world'
    };
              
// Export in such a way that it can be shared between server and client.                       
})(typeof exports === 'undefined'? this['world']={}: module.exports);