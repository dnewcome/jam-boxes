/*globals EventEmitter: true */

var Shape = (function() {

  // A base shape.  To be shared among other shapes.
  function Shape() {
    this.init.apply(this, arguments);
  }

  // inherit from EventEmitter
  Shape.prototype = new View();
  $.extend(Shape.prototype, {
    constructor: Shape,
    init: function(config) {
      // All of the shapes.
      this.shapes = [];
      View.prototype.init.call(this, config);
    },

    // track an element and attach DND behaviors
    trackEl: function(el) {
      var me = this;

      me.shapes.push(el);

      el.drag(function(dx, dy) {
        me.dndManager.dragMove(me, dx, dy);
      }, function(dx, dy) {
        me.dndManager.dragStart(me);
      }, function() {
        me.dndManager.dragUp(me);
      });
    },

    // remove the widget and all of its elements
    remove: function () {
      for( var i=0, shape; shape = this.shapes[i]; i++ ) {
        shape.remove();
      }

      this.shapes = [];
    }
  });

  return Shape;

}());
