/*globals Shape: true */

var TransportButton = (function() {
  var SELECTED_COLOR = '90-#e6fd91-#e128d9';
  var SELECTED_COLOR_HIGHLIGHT = '90-#e486b5-#f75af0';
  var CLEAR_COLOR = '#fff';
  var NORMAL_STROKE = '#e63d91';
  var NORMAL_STROKE_WIDTH = 2;
  var ZOOM_FACTOR = 3;

  var OUTER_COLOR_HIGHLIGHT = '90-#f6ff63-#fdffdd';

  function createOuter() {
    var me = this,
        paper = me.paper,
        outer = me.outer = paper.rect(me.xpos, me.ypos, me.width, me.height,
      10).attr({ fill: this.color });
	var text = paper.text( me.xpos+me.width/2, me.ypos+me.height/2, me.text );
	text.attr( {stroke:'white',fill:'white','font-size':'20'} );

    $(outer.node).bind('click', me.onOuterClick.bind(me));
    me.trackEl(outer);
  }



  var Box = function(config) {
    Shape.prototype.constructor.apply(this, arguments);
  };
  Box.prototype = new Shape();
  $.extend(Box.prototype, {
    init: function(config) {
      var me=this;
      me.columnBoxes = [];

      Shape.prototype.init.call(me, config);

      $(window).bind("click", me.onPaperClick.bind(me));
    },

    draw: function() {
      var me=this;

      createOuter.call(me);
      // createInner.call(me);
    },

    onOuterClick: function(event) {
      var me = this;
      me.onclick();
    },

    onPaperClick: function() {
      var me = this;
      me.onclick();
    }

  });

  return Box;
}());
