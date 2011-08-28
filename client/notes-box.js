/*globals Shape: true */

function NotesBoxRegistry() {
	this.boxes = [];
}

notesBoxRegistry = new NotesBoxRegistry();

var NotesBox = (function() {
  var NOTES = 10;
  //var SELECTED_COLOR = '90-#66ddf3-#15bfde';
  var SELECTED_COLOR = '90-#e63d91-#e128d9';
  var CLEAR_COLOR = '#fff';
  var NORMAL_STROKE = '#e63d91';
  var NORMAL_STROKE_WIDTH = 2;
  var DROPPABLE_STROKE = '#ffffff';
  var DROPPABLE_STROKE_WIDTH = 4;
  var ZOOM_FACTOR = 3;

  function createOuter() {
    var me = this,
        paper = me.paper,
        outer = me.outer = paper.rect(me.xpos, me.ypos, me.width, me.height,
      10).attr({ fill: '90-#f1ff14-#f8ff8d' });

    me.leaveDrop();

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

    var BEAT_WIDTH = me.innerWidth / me.notesPerMeasure;
    var NOTE_HEIGHT = me.innerHeight / NOTES;

	inner.attr({stroke: '#ff0000', 'stroke-width': 2, opacity: 0.75});
    me.trackEl(inner);
    for (var i=0; i < me.notesPerMeasure; ++i) {
      // this is the offset into the model
      var dataI = i + me.ind;
      noteBoxes[dataI] = [];
      for (var j=0; j < NOTES; ++j) {
        var x = innerStartX + i * BEAT_WIDTH,
            y = innerStartY + j * NOTE_HEIGHT,
            note = paper.rect(x, y, BEAT_WIDTH, NOTE_HEIGHT);
            me.updateNoteDisplay(note, false);

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
      me.noteBoxes = [];

      Shape.prototype.init.call(me, config);

      $(window).bind("click", me.onPaperClick.bind(me));
      me.data.on("update", me.onModelUpdate.bind(me));
      me.setEditable(false);
      me.updateFromData();
    },

    updateFromData: function() {
      var me = this,
          values = me.data.getValues(me.ind),
          len = values.length;


      for(var i = 0, value; i < len; ++i) {
        value = values[i];

        me.onModelUpdate(i + me.ind, value);
      }
    },

    draw: function() {
      var me=this;

      createOuter.call(me);
      createInner.call(me);
    },

    setEditable: function(editable) {
      var me = this;

      if(editable !== me.editable && me.data.ownerId === 0) {
        me.editable = editable;
        me.zoom(editable ? ZOOM_FACTOR : 1);
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
		  this.outer.attr({
        stroke: DROPPABLE_STROKE,
        'stroke-width': DROPPABLE_STROKE_WIDTH
      });
    },

    leaveDrop: function() {
		  this.outer.attr({
        stroke: NORMAL_STROKE,
        'stroke-width': NORMAL_STROKE_WIDTH
      });
    },

    updateNoteDisplay: function(note, selected) {
      if(selected !== note.selected) {
        note.attr({
          stroke: selected ? '#000000' : 'none',
          /*'stroke-opacity': 0.5,*/
          fill: selected ? SELECTED_COLOR : CLEAR_COLOR,
          'fill-opacity': selected ? 1.0 : 0.001
        });
        note.selected = selected;
      }
    },

    onModelUpdate: function(index, value) {
      var me=this,
          noteBoxes = me.noteBoxes[index];

      if (noteBoxes) {
        noteBoxes.forEach(function(note, j) {
          var selected = value === j;
          me.updateNoteDisplay(note, selected);
        });
      }
    },

    onNoteClick: function(x, y, event) {
      var me=this;
      me.ignorePaperClick = true;
      if (me.editable) {
        var currVal = me.data.getVal(x);
        // If same value, that means toggle it off.
        if(currVal === y) {
          y = undefined;
        }
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
