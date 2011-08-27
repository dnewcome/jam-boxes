// A basic user view, takes care of mute buttons, name displays, etc.
var UserView = (function() {
  var View = function(config) {
    if(config) {
      this.init(config);
    }
  };

  View.prototype = new EventEmitter();
  $.extend(View.prototype, {
    init: function(config) {
      var me=this;
      $.extend(me, config);
      this.draw();
    },

    draw: function() {

    }
  });

  return View;
}());

