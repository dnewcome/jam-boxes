function BoxDNDManager() {
	this.destination = 'undefined';
	this.dragBox = 'undefined';
	this.ghost = 'undefined';

	

	this.dragStart = function(box) {
		if (typeof this.dragBox !== 'undefined') {
			return;
		}

		this.ghost = {};
		this.ghost.shapes = [];
		this.ghost.locations = [];

		for( var i=0; i < box.shapes.length; i++ ) {
			this.ghost.shapes[i] = box.shapes[i].clone();
			this.ghost.shapes[i].attr({opacity: 0.2});
		}
	}

	this.dragMove = function(box, dx, dy) {
		if (box != this.dragBox) {
			return;
		}

		for (var i=0; i<box.shapes.length; i++) {
			var obj = this.ghost.shapes[i];
			obj.attr({ x: obj.ox + dx, y: obj.oy + dy });	// from http://grover.open2space.com/sites/default/files/articles/raphael/drag.htm
		}
	}

	this.dragUp = function(box) {
		if (box != this.dragBox) {
			return;
		}

		if (typeof this.destination !== 'undefined') {
			this.destination.receiveDrop(this.dragBox);
		}

		// remove the ghost from the screen
		for (var i=0; i < this.ghost.shapes.length; i++) {
			this.ghost.shapes[i].remove();
		}

		this.dragBox = 'undefined';
		this.ghost = 'undefined';
		this.destination = 'undefined';
	}

	this.destMouseEnter = function(box) {
		if (this.dragBox != box && box.data.ownerId === 1) {	// make sure destination != source and that the user owns the destination
			this.destination = box;
			this.destination.enterDrop();
		}
	}

	this.destMouseLeave = function(box) {
		if (this.destination !== 'undefined') {
			this.destination.leaveDrop();
			this.destination = 'undefined';
		}
	}
}

effectsBoxDNDManager = new BoxDNDManager();