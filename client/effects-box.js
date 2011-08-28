//
//		EffectsData model
//

function EffectsBoxRegistry() {
	this.boxes = [];
}

effectsBoxRegistry = new EffectsBoxRegistry();

// there is one EffectsData model per user, which keeps track of the effects values
function EffectsData(ownerId, measures, notesPerMeasure) {
	var that = this;

	this.unitsPerNote = 8;
	this.notesPerBox = notesPerMeasure;
	this.numBoxes = measures;

	this.overrideProvider = undefined;

	this.ownerId = ownerId;	// if owner is local user, ownerId = 0

	this.values = [];	// each value is of the form [x, y], where x and y are between 0-1 inclusive

	this.numValues = this.unitsPerNote*this.notesPerBox*this.numBoxes;
	this.currentIndex = 0;	// this should be between 0 and (this.numValues-1) inclusive

	for (var i=0; i<this.numValues; i++) {
		this.values[i] = [0.5, 0.5];
	}

	this.getValues = function(boxInd) {
		if (boxInd < 0 || boxInd >= this.numBoxes) {
			return [];
		}
		var indices = [];

		var begin = boxInd*that.unitsPerNote*that.notesPerBox;
		var end = begin + that.unitsPerNote*that.notesPerBox;
		for (var i=begin; i<end; i++) {
			indices[i-begin] = that.values[i];
		}

		return indices;
	};

	this.indexInBox = function(ind, boxInd) {
		if (boxInd < 0 || boxInd >= this.numBoxes) {
			return false;
		}

		var begin = boxInd*that.unitsPerNote*that.notesPerBox;
		var end = begin + that.unitsPerNote*that.notesPerBox;

		if (ind >= begin && ind < end) {
			return true;
		}
		else {
			return false;
		}
	};

	this.boxForIndex = function(ind) {
		if (ind < 0 || ind >= that.numValues) {
			return undefined;
		}

		for (var i=0; i<that.numBoxes; i++) {
			var begin = i*that.notesPerBox*that.unitsPerNote;
			var end = (i+1)*that.notesPerBox*that.unitsPerNote;
			if (ind >= begin && ind < end) {
				return i;
			}
		}
		return undefined;
	}

	this.copy = function(ind, values) {
		var shouldUpdate = false;
		if (that.currentIndex <= ind*that.unitsPerNote*that.notesPerBox &&
			that.currentIndex >= (ind+1)*that.unitsPerNote*that.notesPerBox) {
			shouldUpdate = true;
		}
		for (var i=0; i<values.length; i++) {
			that.setVal(i+ind*that.unitsPerNote*that.notesPerBox, values[i], shouldUpdate);
		}
	};

  $(window).bind('tick', this.tick.bind(this));
}

EffectsData.prototype = new EventEmitter();

EffectsData.prototype.tick = function() {
	this.currentIndex = this.currentIndex+1;
	if (this.currentIndex >= this.numValues) {
		this.currentIndex = 0;
	}

	if (typeof this.overrideProvider !== 'undefined') {
		this.values[this.currentIndex] = this.overrideProvider.getOverrideValue();
	}

	this.emit('update', this.currentIndex, this.values[this.currentIndex]);
}

// val: value to be set
// ind: index of the value to be set
// shouldUpdate: whether or not the UI should receive an update notification
EffectsData.prototype.setVal = function(ind, val, shouldUpdate) {
	this.values[ind] = val;
	if (shouldUpdate == true) {
		this.emit('update', this.currentIndex, this.values[this.currentIndex]);
	}
};

EffectsData.prototype.setValOverride = function(overrideProvider) {
	this.overrideProvider = overrideProvider;
}

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
		fill: '90-#f1f400-#e8f250',
		stroke: '#e63d91',
		'stroke-width': 2
		};
	this.mainBoxAttrHighlight = {
		fill: '90-#f8fa73-#f8fda9',
		'stroke-width': 2
	};
	this.mainBox.attr(this.mainBoxAttr);

	this.effectsPoint = paper.rect(this.xpos + 0.5*(this.width-16) + 5, this.ypos + 0.5*(this.width-16) + 5, 10, 10, 5);
	this.effectsPoint.attr({fill: '90-#e63d91-#e128d9', stroke: '#000000'});

	// box which handles all mouse events
	var eventBox = paper.rect(this.xpos, this.ypos, this.width, this.height);
	eventBox.attr({fill: '#000000', 'fill-opacity': 0.01, stroke: 'none'});

	eventBox.mousedown(function(event) {
		if(event.preventDefault) {
			event.preventDefault();
		}
	});

	eventBox.drag(	effectsBoxDNDManager.dragMove.bind(effectsBoxDNDManager, this),
					effectsBoxDNDManager.dragStart.bind(effectsBoxDNDManager, this),
					effectsBoxDNDManager.dragUp.bind(effectsBoxDNDManager, this));

	this.shapes.push(this.mainBox, this.effectsPoint, eventBox);

	data.on('update', function(ind, val) {
		if (that.data.boxForIndex(ind) == that.ind) {
			if (that.mainBox.attrs.fill != that.mainBoxAttrHighlight.fill) {
				that.mainBox.attr({fill: that.mainBoxAttrHighlight.fill});
			}
			var newX = that.xpos + val[0]*(that.width-16) + 5;
			var newY = that.ypos + val[1]*(that.height-16) + 5;
			that.effectsPoint.attr({x: newX, y: newY});
		}
		else {
			that.mainBox.attr({fill: that.mainBoxAttr.fill});
		}
	});

	this.enterDrop = function() {
		that.mainBox.attr({stroke: "#ffffff", 'stroke-width': 4});
	};

	this.leaveDrop = function() {
		that.mainBox.attr(that.mainBoxAttr);
	};
}


function EffectsController(x, y, width, height, data) {
	var that = this;

	this.xpos = x;
	this.ypos = y;
	this.width = width;
	this.height = height;

	this.data = data;

	this.shapes = [];

	this.mainBox = paper.rect(this.xpos, this.ypos, this.width, this.height, 10);
	this.mainBoxAttr = {
		fill: '90-#f1f400-#e8f250',
		stroke: '#e63d91',
		'stroke-width': 2
		};
	this.mainBox.attr(this.mainBoxAttr);

	this.effectsPoint = paper.rect(this.xpos + 0.5*(this.width-16) + 5, this.ypos + 0.5*(this.width-16) + 5, 10, 10, 5);
	this.effectsPoint.attr({fill: '90-#e63d91-#e128d9', stroke: '#000000'});

	// box which handles all mouse events
	var eventBox = paper.rect(this.xpos, this.ypos, this.width, this.height);
	eventBox.attr({fill: '#000000', 'fill-opacity': 0.01, stroke: 'none'});

	this.overrideValue = undefined;

	this.isMouseDown = false;
	this.wasInEventBox = false;

	if (this.data.ownerId === 0) {
		eventBox.mousedown(function(event) {
			if(event.preventDefault) {
				event.preventDefault();
			}
			that.isMouseDown = true;
			var xVal = (event.layerX-that.xpos)/that.width;
			var yVal = (event.layerY-that.ypos)/that.height;
			that.overrideValue = [xVal, yVal];
			that.data.setValOverride(that);
		});

		this.onMouseUp = function(event) {
			that.isMouseDown = false;
			if (typeof that.overrideValue !== 'undefined') {
				that.data.setValOverride(undefined);
				that.overrideValue = undefined;
			}
		};

		eventBox.mouseup(this.onMouseUp);

		eventBox.mousemove(function(event) {
			if (typeof that.overrideValue !== 'undefined' && that.isMouseDown === true) {
				var xVal = (event.layerX-that.xpos)/that.width;
				var yVal = (event.layerY-that.ypos)/that.height;
				that.overrideValue = [xVal, yVal];
			}
		});

		eventBox.mouseout(function(event) {
			if (typeof that.overrideValue !== 'undefined') {
				that.wasInEventBox = true;
			}
		});

		eventBox.mouseover(function(event) {
			if (that.wasInEventBox === true && that.isMouseDown === true) {
				that.wasInEventBox = false;
				var xVal = (event.layerX-that.xpos)/that.width;
				var yVal = (event.layerY-that.ypos)/that.height;
				that.overrideValue = [xVal, yVal];
				that.data.setValOverride(that);
			}
		});

		eventBox.drag(function() {}, function() {}, function() {});
	}

	this.shapes.push(this.mainBox, this.effectsPoint, eventBox);

	data.on('update', function(ind, val) {
		var newX = that.xpos + val[0]*(that.width-16) + 5;
		var newY = that.ypos + val[1]*(that.height-16) + 5;
		that.effectsPoint.attr({x: newX, y: newY});
	});

	this.getOverrideValue = function() {
		return that.overrideValue;
	}
}