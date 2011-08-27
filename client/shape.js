/*globals EventEmitter: true */

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
    // All of the shapes.
    this.shapes = [];
    this.draw();
  },

  /**
  * remove the widget and all of its elements
  */
  remove: function () {
    for( var i=0, shape; shape = this.shapes[i]; i++ ) {
      shape.remove();
    }

    this.shapes = [];
  },

  /**
  * Draw the control contents
  */
  draw: function( val ) {
  }

});




