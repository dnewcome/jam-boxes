function rectIntersect(rect1, rect2) {	/* from cocosCairo */
		var left1 = rect1.xpos;
		var top1 = rect1.ypos;
		var right1 = rect1.xpos+rect1.width;
		var bottom1 = rect1.ypos+rect1.height;

		var left2 = rect2.xpos;
		var top2 = rect2.ypos;
		var right2 = rect2.xpos+rect2.width;
		var bottom2 = rect2.ypos+rect2.height;

		var doesIntersect = 	((left2 < right1) &&
							(right2 > left1) &&
							(top2 < bottom1) &&
							(bottom2 > top1));
		if (doesIntersect) {
			return true;
		}
		else {
			return false;
		}
}

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
	};

	this.dragMove = function(box, dx, dy) {
		if (box != that.dragBox) {
			return;
		}

		for (var i=0; i<box.shapes.length; i++) {
			var obj = that.ghost.shapes[i];
			var bbox = that.ghostBBoxes[i];
			obj.attr({ x: bbox.x + dx, y: bbox.y + dy });
		}

		var inBox = false;
		for (var i=0; i<effectsBoxRegistry.boxes.length; i++) {
			var xloc = that.dragBox.xpos+dx;
			var yloc = that.dragBox.ypos+dy;

			var destBox = effectsBoxRegistry.boxes[i];
			if (destBox == that.dragBox) {
				continue;
			}
			if (rectIntersect({xpos: xloc, ypos: yloc, width: that.dragBox.width, height: that.dragBox.height},
				{xpos: destBox.xpos, ypos: destBox.ypos, width: destBox.width, height: destBox.height})) {
				if (typeof that.destination === 'undefined') {
					that.destMouseEnter(destBox, null);
				}
				inBox = true;
				break;
			}		
		}
		if (!inBox && typeof that.destination !== 'undefined') {
			that.destMouseLeave(that.destination, null);
		}
	};

	this.dragUp = function(box) {
		if (box != that.dragBox) {
			return;
		}

		if (typeof that.destination !== 'undefined') {
			var srcData = that.dragBox.data.getValues(that.dragBox.ind);
			that.destination.data.receiveDrop(that.dragBox.ind, srcData);
			that.destMouseLeave(that.destination, null);
		}

		// remove the ghost from the screen
		for (var i=0; i < that.ghost.shapes.length; i++) {
			that.ghost.shapes[i].remove();
		}

		that.dragBox = undefined;
		that.ghost = undefined;
		that.ghostBBoxes = [];
		that.destination = undefined;
	};

	this.destMouseEnter = function(box, event) {
		if (typeof that.dragBox !== 'undefined' && that.dragBox != box && box.data.ownerId === 0) {	// make sure destination != source and that the user owns the destination
			that.destination = box;
			that.destination.enterDrop();
		}
	};

	this.destMouseLeave = function(box, event) {
		if (that.destination !== undefined) {
			that.destination.leaveDrop();
			that.destination = undefined;
		}
	};
}

effectsBoxDNDManager = new BoxDNDManager();