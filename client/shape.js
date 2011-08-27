/*globals EventEmitter: true */

var Shape = (function() {

  // A base shape.  To be shared among other shapes.
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

    // track an element and attach DND behaviors
    trackEl: function(el) {
      var me = this,
          click = true;

      me.shapes.push(el);

      el.drag(function(dx, dy) {
        effectsBoxDNDManager.dragMove(me, dx, dy);
        click = false;
      }, function(dx, dy) {
        effectsBoxDNDManager.dragStart(me);
        // manually keep track of whether this is a click since Raphael is
        // inept and does not use the DOM properly and then cancels events.
        // If we find that the box does not move on dragUp, manually trigger a
        // click event on the node so that our click handlers still get called.
        click = true;
      }, function() {
        effectsBoxDNDManager.dragUp(me);
        if (click) {
          $(el.node).click();
        }
      });
    },

    // remove the widget and all of its elements
    remove: function () {
      for( var i=0, shape; shape = this.shapes[i]; i++ ) {
        shape.remove();
      }

      this.shapes = [];
    },

    // draw the control contents
    draw: function( val ) {
    },

    onClick: function() {

    }

  });

  return Shape;

}());
