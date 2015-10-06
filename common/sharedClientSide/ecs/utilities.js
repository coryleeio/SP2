










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

	// returns an array containing the powerset of compoundKeys minus the empty set where 
    // each tuple is represented as a string with no spaces with each componentType appended in alphabetical order.
	calculatePossibleCompoundKeys: function(componentTypes) {
		// only support singular keys for now.
		var sortedArray = componentTypes.sort();
		return sortedArray;
	}
};