function BoxDNDManager() {
	var that = this;

	this.destination = undefined;
	this.dragBox = undefined;
	this.ghost = undefined;
	this.ghostBBoxes = [];
	

	

	this.dragStart = function(box) {
		if (typeof that.dragBox !== 'undefined') {
			return;
		}

		that.dragBox = box;

		that.ghost = {};
		that.ghost.shapes = [];
		that.ghostBBoxes = [];

		for( var i=0; i < box.shapes.length; i++ ) {
			that.ghost.shapes[i] = box.shapes[i].clone();
			that.ghost.shapes[i].attr({opacity: 0.2});
			that.ghostBBoxes[i] = that.ghost.shapes[i].getBBox();
		}
	}

	this.dragMove = function(box, dx, dy) {
		if (box != that.dragBox) {
			return;
		}

		for (var i=0; i<box.shapes.length; i++) {
			var obj = that.ghost.shapes[i];
			var bbox = that.ghostBBoxes[i];
			obj.attr({ x: bbox.x + dx, y: bbox.y + dy });
		}
	}

	this.dragUp = function(box) {
		if (box != that.dragBox) {
			return;
		}

		if (typeof that.destination !== 'undefined') {
			var srcData = that.dragBox.data.getValues(that.dragBox.ind);
			that.destination.data.receiveDrop(srcData, that.dragBox.ind);
		}

		// remove the ghost from the screen
		for (var i=0; i < that.ghost.shapes.length; i++) {
			that.ghost.shapes[i].remove();
		}

		that.dragBox = undefined;
		that.ghost = undefined;
		that.ghostBBoxes = [];
		that.destination = undefined;
	}

	this.destMouseEnter = function(box) {
		if (that.dragBox != box && box.data.ownerId === 1) {	// make sure destination != source and that the user owns the destination
			that.destination = box;
			that.destination.enterDrop();
		}
	}

	this.destMouseLeave = function(box) {
		if (that.destination !== undefined) {
			that.destination.leaveDrop();
			that.destination = undefined;
		}
	}
}

effectsBoxDNDManager = new BoxDNDManager();