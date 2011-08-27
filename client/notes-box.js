NotesBox = (function() {
  var BEATS = 4;
  var NOTES = 10;

  var Box = function() {};

  Box.prototype = {
    init: function(config) {
      var me=this;
      me.paper = config.paper;
      me.startX = config.startX;
      me.startY = config.startY;
    },

    draw: function() {
      var me=this, paper=me.paper;
      paper.rect(me.startX, me.startY, 48, 48);
    }
  };

  return Box;
}());
