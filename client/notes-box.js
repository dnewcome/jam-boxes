/*globals Shape: true */

var NotesBox = (function() {
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
  var SELECTED_COLOR = '#000';
  var CLEAR_COLOR = '#fff';

  var Box = function(config) {
    Shape.prototype.constructor.apply(this, arguments);
  };
  Box.prototype = new Shape();
  $.extend(Box.prototype, {
    init: function(config) {
      var me=this;
      me.model = config.model;
      me.paper = config.paper;
      me.startX = config.startX;
      me.startY = config.startY;
      me.noteBoxes = [];

      Shape.prototype.init.call(this);

      me.model.on("update", this.updateNote.bind(this));
    },

    draw: function() {
      var me=this,
          paper = me.paper,
          shapes = me.shapes,
          noteBoxes = me.noteBoxes;

      var outer = me.outer = paper.rect(me.startX, me.startY, OUTER_WIDTH, OUTER_HEIGHT,
        10).attr({
        fill: '#fff'
      });

      var inner = paper.rect(INNER_X_OFFSET, INNER_Y_OFFSET, INNER_WIDTH, INNER_HEIGHT);
      shapes.push(inner);

      for (var i=0; i < BEATS; ++i) {
        noteBoxes[i] = [];
        for (var j=0; j < NOTES; ++j) {
          var x = INNER_X_OFFSET + i * BEAT_WIDTH;
          var y = INNER_Y_OFFSET + j * NOTE_HEIGHT;
          var note = paper.rect(x, y, BEAT_WIDTH, NOTE_HEIGHT).attr({
            fill: CLEAR_COLOR,
            stroke: "none"
          }).click(me.onNoteClick.bind(note, me, i, j));

          shapes.push(note);
          noteBoxes[i][j] = note;
        }
      }

      shapes.push(outer);
    },

    onNoteClick: function(box, x, y, event) {
      box.model.setVal(x, y, true);
    },

    updateNote: function(index, value) {
      var me=this,
          noteBoxes = me.noteBoxes[index];

      noteBoxes.forEach(function(note, j) {
        note.attr({
          fill: value === j ? SELECTED_COLOR : CLEAR_COLOR
        });
      });
    }

  });

  return Box;
}());
