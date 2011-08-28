/*globals Shape: true */

var TransportButton = function( attrs ) {
  var SELECTED_COLOR = '90-#e6fd91-#e128d9';
  var SELECTED_COLOR_HIGHLIGHT = '90-#e486b5-#f75af0';
  var CLEAR_COLOR = '#fff';
  var NORMAL_STROKE = '#e63d91';
  var NORMAL_STROKE_WIDTH = 2;
  var ZOOM_FACTOR = 3;

  var OUTER_COLOR_HIGHLIGHT = '90-#f6ff63-#fdffdd';

  function createOuter( attrs ) {
    var me = attrs,
        paper = me.paper,
        outer = me.outer = paper.rect(me.xpos, me.ypos, me.width, me.height,
      10).attr({ fill: me.color,stroke: NORMAL_STROKE,'stroke-width':NORMAL_STROKE_WIDTH });
	var text = paper.text( me.xpos+me.width/2, me.ypos+me.height/2, me.text );
	text.attr( {stroke:'white',fill:'white','font-size':'20'} );
	outer.click( me.onclick );
	text.click( me.onclick );

  }

  createOuter( attrs );

};
