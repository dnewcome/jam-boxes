/*globals Shape: true */

var NotesBox = (function() {
  var BEATS = 4;
  var NOTES = 10;
  var OUTER_WIDTH = 48;
  var OUTER_HEIGHT = 48;
  var INNER_WIDTH = 36;
  var INNER_HEIGHT = 36;
  var INNER_X_OFFSET = (OUTER_WIDTH - INNER_WIDTH)/2;
  var INNER_Y_OFFSET = (OUTER_HEIGHT - INNER_HEIGHT)/2;
  var BEAT_WIDTH = INNER_WIDTH / BEATS;
  var NOTE_HEIGHT = INNER_HEIGHT / NOTES;
  var SELECTED_COLOR = '#000';
  var CLEAR_COLOR = '#fff';



  function createOuter() {
    var me = this,
        paper = me.paper,
        outer = me.outer = paper.rect(me.xpos, me.ypos, OUTER_WIDTH, OUTER_HEIGHT,
      10).attr({
      fill: '#fff'
    });

    $(outer.node).bind('click', me.onOuterClick.bind(me));
    me.shapes.push(outer);
  }

  function createInner() {
    var me = this,
        paper = me.paper,
        shapes = me.shapes,
        noteBoxes = me.noteBoxes,
        innerStartX = me.xpos + INNER_X_OFFSET,
        innerStartY = me.ypos + INNER_Y_OFFSET,
        inner = paper.rect(innerStartX, innerStartY, INNER_WIDTH, INNER_HEIGHT);

    for (var i=0; i < BEATS; ++i) {
      // this is the offset into the model
      var modelI = i + me.modelOffset;
      noteBoxes[modelI] = [];
      for (var j=0; j < NOTES; ++j) {
        var x = innerStartX + i * BEAT_WIDTH,
            y = innerStartY + j * NOTE_HEIGHT,
            note = paper.rect(x, y, BEAT_WIDTH, NOTE_HEIGHT).attr({
              fill: CLEAR_COLOR,
              stroke: "none"
            });

        var node = note.node;
        // We pass the modelI and j so that we can set the model
        $(note.node).bind('click', me.onNoteClick.bind(me, modelI, j));

        shapes.push(note);
        noteBoxes[modelI][j] = note;
      }
    }

    shapes.push(inner);
  }


  var Box = function(config) {
    Shape.prototype.constructor.apply(this, arguments);
  };
  Box.prototype = new Shape();
  $.extend(Box.prototype, {
    init: function(config) {
      var me=this;
      $.extend(me, config);

      me.width = OUTER_WIDTH;
      me.height = OUTER_HEIGHT;

      me.noteBoxes = [];

      Shape.prototype.init.call(this);

      $(me.paper.canvas).bind("click", me.onPaperClick.bind(me));
      me.model.on("update", this.onModelUpdate.bind(this));
      this.setEditable(false);
    },

    draw: function() {
      var me=this;

      createOuter.call(me);
      createInner.call(me);
    },

    setEditable: function(editable) {
      var me = this;

      if(editable !== me.editable) {
        me.editable = editable;
        me.zoom(editable ? 2 : 1);
      }
    },

    zoom: function(factor) {
      var me = this,
          outer = me.outer,
          attrs = outer.attrs,
          cx = attrs.x + attrs.width/2,
          cy = attrs.y + attrs.height/2,
          shapes = me.shapes;

        var params = {scale: "" + factor + " " + factor + " " + cx + " " + cy};

        shapes.forEach(function(shape, index) {
          shape.animate(params, 300, "bounce");
        });
    },

    onModelUpdate: function(index, value) {
      var me=this,
          noteBoxes = me.noteBoxes[index];

      if (noteBoxes) {
        noteBoxes.forEach(function(note, j) {
          note.attr({
            fill: value === j ? SELECTED_COLOR : CLEAR_COLOR
          });
        });
      }
    },

    onNoteClick: function(x, y, event) {
      event.stopPropagation();

      var me=this;
      if (me.editable) {
        me.model.setVal(x, y, true);
      }
      else {
        me.setEditable(true);
      }
    },

    onOuterClick: function(event) {
      event.stopPropagation();

      this.setEditable(true);
    },

    onPaperClick: function() {
      this.setEditable(false);
    }

  });

  return Box;
}());
