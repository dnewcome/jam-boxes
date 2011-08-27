// A basic user view, takes care of mute buttons, name displays, etc.
var UserView = (function() {

  function onNameChange(key, value) {

  }

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
      me.data.on("update:name", onNameChange.bind(me));
    },

    draw: function() {
      var me = this,
          data = me.data,
          el = $("#canvas");

      $('<div class="username">').text(data.getVal('name')).css({
        top: me.ypos
      }).appendTo(el);

    }
  });

  return View;
}());

