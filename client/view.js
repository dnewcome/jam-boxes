// A basic user view, takes care of mute buttons, name displays, etc.
var View = (function() {
  var View = function(config) {
    if(config) {
      this.init(config);
    }
  };

  View.prototype = new EventEmitter();
  $.extend(View.prototype, {
    constructor: View,
    init: function(config) {
      var me=this;
      $.extend(me, config);
      this.draw();
    },

    draw: function() {

    },

    // bind a field to a function that will update the field's view
    // whenever the model changes.
    bindField: function(key, callback) {
      var me=this;
      me.data.on("update:" + key, callback.bind(me));
      callback.call(me, key, me.data.getVal(key));
    }
  });

  return View;
}());

