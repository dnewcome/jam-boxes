NotesBox = (function() {
  var BEATS = 4;
  var NOTES = 10;
  var OUTER_WIDTH = 48;
  var OUTER_HEIGHT = 48;
  var INNER_WIDTH = 40;
  var INNER_HEIGHT = 40;
  var INNER_X_OFFSET = (OUTER_WIDTH - INNER_WIDTH)/2;
  var INNER_Y_OFFSET = (OUTER_HEIGHT - INNER_HEIGHT)/2;
  var BEAT_WIDTH = INNER_WIDTH / BEATS;
  var NOTE_HEIGHT = INNER_HEIGHT / NOTES;

  var Box = function(config) {
    Shape.prototype.constructor.apply(this, arguments);
  };
  Box.prototype = new Shape();
  $.extend(Box.prototype, {
    init: function(config) {
      var me=this;
      me.paper = config.paper;
      me.startX = config.startX;
      me.startY = config.startY;

      Shape.prototype.init.call(this);
    },

    draw: function() {
      var me=this, paper = me.paper, shapes = me.shapes;

      var outer = me.outer = paper.rect(me.startX, me.startY, OUTER_WIDTH, OUTER_HEIGHT,
        10).attr({
        fill: '#fff'
      });

      var inner = paper.rect(INNER_X_OFFSET, INNER_Y_OFFSET, INNER_WIDTH, INNER_HEIGHT);
      shapes.push(inner);

      for (var i=0; i < BEATS; i++) {
        for (var j=0; j < NOTES; j++) {
          var x = INNER_X_OFFSET + i * BEAT_WIDTH;
          var y = INNER_Y_OFFSET + j * NOTE_HEIGHT;
          var item = paper.rect(x, y, BEAT_WIDTH, NOTE_HEIGHT).attr({
            fill: '#fff'
          });

          shapes.push(inner);
        }
      }

      shapes.push(outer);
    }

  });

  return Box;
}());
