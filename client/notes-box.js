/*globals Shape: true */

var NotesBox = (function() {
  var BEATS = 4;
  var NOTES = 10;
  var SELECTED_COLOR = '#000';
  var CLEAR_COLOR = '#fff';



  function createOuter() {
    var me = this,
        paper = me.paper,
        outer = me.outer = paper.rect(me.xpos, me.ypos, me.width, me.height,
      10).attr({
      fill: '#fff'
    });

    $(outer.node).bind('click', me.onOuterClick.bind(me));
    me.trackEl(outer);
  }

  function createInner() {
    var me = this,
        paper = me.paper,
        noteBoxes = me.noteBoxes,
        innerXOffset = (me.width - me.innerWidth)/2,
        innerYOffset = (me.height - me.innerHeight)/2,
        innerStartX = me.xpos + innerXOffset,
        innerStartY = me.ypos + innerYOffset,
        inner = paper.rect(innerStartX, innerStartY, me.innerWidth, me.innerHeight);

    var BEAT_WIDTH = me.innerWidth / BEATS;
    var NOTE_HEIGHT = me.innerHeight / NOTES;

    me.trackEl(inner);
    for (var i=0; i < BEATS; ++i) {
      // this is the offset into the model
      var dataI = i + me.ind;
      noteBoxes[dataI] = [];
      for (var j=0; j < NOTES; ++j) {
        var x = innerStartX + i * BEAT_WIDTH,
            y = innerStartY + j * NOTE_HEIGHT,
            note = paper.rect(x, y, BEAT_WIDTH, NOTE_HEIGHT).attr({
              fill: CLEAR_COLOR,
              stroke: "none"
            });

        var node = note.node;
        // We pass the dataI and j so that we can set the model
        $(note.node).bind('click', me.onNoteClick.bind(me, dataI, j));

        me.trackEl(note);
        noteBoxes[dataI][j] = note;
      }
    }

  }


  var Box = function(config) {
    Shape.prototype.constructor.apply(this, arguments);
  };
  Box.prototype = new Shape();
  $.extend(Box.prototype, {
    init: function(config) {
      var me=this;
      $.extend(me, config);

      me.noteBoxes = [];

      Shape.prototype.init.call(this);

      $(me.paper.canvas).bind("click", me.onPaperClick.bind(me));
      me.data.on("update", this.onModelUpdate.bind(this));
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
        if (editable) {
          me.shapes.forEach(function(shape) {
            shape.toFront();
          });
        }
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

    enterDrop: function() {

    },

    leaveDrop: function() {

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
      var me=this;
      me.ignorePaperClick = true;
      if (me.editable) {
        me.data.setVal(x, y, true);
      }
      else {
        me.setEditable(true);
      }
    },

    onOuterClick: function(event) {
      var me = this;
      if (!me.ignorePaperClick) {
        me.setEditable(true);
        me.ignorePaperClick = true;
      }
    },

    onPaperClick: function() {
      var me = this;
      if (!me.ignorePaperClick) {
        me.setEditable(false);
      }

      me.ignorePaperClick = false;
    }

  });

  return Box;
}());
