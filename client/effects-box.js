// there is one EffectsData model per user, which keeps track of the effects values
function EffectsData() {
	var unitsPerNote = 8;
	var notesPerBox = 4;
	var numBoxes = 8;

	this.values = [];	// each value is of the form [x, y], where x and y are between 0-1 inclusive

	var totalValues = unitsPerNote*notesPerBox*numBoxes;
	for (int i=0; i<totalValues; i++) {
		this.values[i] = [0.5, 0.5];
	}
}

//function 