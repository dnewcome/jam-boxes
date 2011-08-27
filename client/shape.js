
/*
* A base shape.  To be shared among other shapes.
*/
function Shape() {
  this.init.apply(this, arguments);
}

// inherit from EventEmitter
Shape.prototype = new EventEmitter();
$.extend(Shape.prototype, {
  constructor: Shape,
  init: function() {
    // references to drawn items within the control
    // that may need to be deleted before a redraw
    this.shapes = [];
    this.draw();
  },

  /**
  * clear all drawing state from the control
  */
  clear: function () {
    for( var i=0; i < this.shapes.length; i++ ) {
      this.shapes[i].remove();
    }
  },

  /**
  * Draw the control contents
  */
  draw: function( val ) {
  }

});




