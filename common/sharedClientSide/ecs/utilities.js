










module.exports = {
	// takes an array of componentTypes and 
	// returns them
	// sorted alphabetically, as a single string with no spaces.
	calculateCompoundKey: function(componentTypes) { 
		var compoundKey = "";
		var sortedArray = componentTypes.sort();
		for(var componentTypeIndex in sortedArray) {
			compoundKey += componentTypes[componentTypeIndex];
		}
		return compoundKey;
	},

	// Returns an array containing the powerset of compoundKeys minus the empty set where 
    // each tuple is represented as a string with no spaces with each componentType appended in alphabetical order.
	calculatePossibleCompoundKeys: function(componentTypes) {
      outy = [];
      var sortedArray = componentTypes.sort();
      for(var i = 1; i < Math.pow(2,sortedArray.length); i++){
        var compoundKeyArray = sortedArray.filter(function(element, index, array){
            return (i & (1 << index));
        });
        var compoundKeyString = "";
        compoundKeyArray.forEach(function(key){
          compoundKeyString += key;
        });
        outy.push(compoundKeyString);
      }
      return outy;
	}
};