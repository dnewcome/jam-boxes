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
    this.init(config);
  };

  Box.prototype = {
    init: function(config) {
      var me=this;
      me.paper = config.paper;
      me.startX = config.startX;
      me.startY = config.startY;

      me.draw();
    },

    draw: function() {
      var me=this, paper=me.paper;
      var outer = paper.rect(me.startX, me.startY, OUTER_WIDTH, OUTER_HEIGHT);
      var inner = paper.rect(INNER_X_OFFSET, INNER_Y_OFFSET, INNER_WIDTH, INNER_HEIGHT);

      for (var i=0; i < BEATS; i++) {
        for (var j=0; j < NOTES; j++) {
          var x = INNER_X_OFFSET + i * BEAT_WIDTH;
          var y = INNER_Y_OFFSET + j * NOTE_HEIGHT;
          paper.rect(x, y, BEAT_WIDTH, NOTE_HEIGHT);
        }
      }
    }
  };

  return Box;
}());
