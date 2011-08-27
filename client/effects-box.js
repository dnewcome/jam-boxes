//
//		EffectsData model
//

// there is one EffectsData model per user, which keeps track of the effects values
function EffectsData(ownerId) {
	this.unitsPerNote = 8;
	this.notesPerBox = 4;
	this.numBoxes = 8;

	this.ownerId = ownerId;	// if owner is local user, ownerId = 0

	this.values = [];	// each value is of the form [x, y], where x and y are between 0-1 inclusive

	this.numValues = this.unitsPerNote*this.notesPerBox*this.numBoxes;
	this.currentIndex = 0;	// this should be between 0 and (this.numValues-1) inclusive

	for (var i=0; i<this.numValues; i++) {
		this.values[i] = [0.5, 0.5];
	}

	this.get
}

EffectsData.prototype = new EventEmitter();

// updates the UI. the UI element is responsible for determining whether or not the current index
// should update the UI (i.e. if there is an EffectsBox whose index range does not include the currentIndex)
EffectsData.prototype.updateUI = function(ind) {
	this.currentIndex = this.currentIndex+1;
	this.emit('update', ind, this.values[ind]);
}

// val: value to be set
// ind: index of the value to be set
// shouldUpdate: whether or not the UI should receive an update notification
EffectsData.prototype.setVal = function(val, ind, shouldUpdate) {
	this.values[ind] = val;
	if (shouldUpdate == true) {
		this.updateUI(ind);
	}
};

EffectsData.prototype.getVal = function(ind) {
	this.playIndex(ind);
	return this.values[ind];
};




//
//		EffectsBox UI element
//

// ind: the current index of the effects box, between 0-7 inclusive
function EffectsBox(x, y, width, height, ind, data) {
	var that = this;

	this.ind = ind;

	this.xpos = x;
	this.ypos = y;
	this.width = width;
	this.height = height;

	this.data = data;

	this.shapes = [];

	this.mainBox = paper.rect(this.xpos, this.ypos, this.width, this.height, 10);
	this.mainBoxAttr = {
		fill: '90-#4070B0-#4477BB',
		stroke: '#777777'
		};
	this.mainBoxAttrHighlight = {
		fill: '90-#4477BB-#5588FF',
		stroke: '#999999'
	};
	this.mainBox.attr(mainBoxAttr);

	this.effectsPoint = paper.rect(this.xpos/2 - 5, this.ypos/2 - 5, 10, 10, 1);

	// box which handles all mouse events
	var eventBox = paper.rect(this.xpos, this.ypos, this.width, this.height);
	eventBox.drag(	effectsBoxDNDManager.dragStart.bind(effectsBoxDNDManager, this),
					effectsBoxDNDManager.dragMove.bind(effectsBoxDNDManager, this),
					effectsBoxDNDManager.dragUp.bind(effectsBoxDNDManager, this));

	this.shapes.push(this.mainBox, this.effectsPoint, eventBox);


	data.on('update', function(val, ind) {
		
	});

	this.enterDrop = function() {
		that.mainBox.attr({stroke: "#00ff00"});
	}

	this.leaveDrop = function() {
		that.mainBox.attr(mainBoxAttr);
	}

	this.receiveDrop = function(box) {
		var srcData = box.data;
		var srcDataBegin = box.ind*

		var destData = that.data;

		
	}
}