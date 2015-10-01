(function(exports){
   exports.SP = exports.SP || {};
   exports.SP.gameConstants = {
    stepDelta: 1000/30 // 30fps
   };
// Export in such a way that it can be shared between server and client.                       
}) (typeof exports === 'undefined'? this : module.exports);