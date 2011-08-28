// A basic user view, takes care of mute buttons, name displays, etc.
var UserView = (function() {

  function onNameChange(key, value) {
    var me=this;
    me.root.find('.username').text(value);
  }

  function onMuteChange(key, value) {
    var me=this;
    me.root.find('[name=mute]').attr({
      checked: value
    });
  }

  function onSoloChange(key, value) {
    var me=this;
        el = me.root.find("[name=solo]");
    if(value) {
      el.attr("checked", "checked");
    }
    else {
      el.removeAttr("checked");
    }
  }

  var UserView = function(config) {
    View.prototype.constructor.apply(this, arguments);
  };

  UserView.prototype = new View();
  $.extend(UserView.prototype, {
    constructor: UserView,
    init: function(config) {
      var me=this;
      View.prototype.init.call(me, config);

      me.bindField("name", onNameChange);
      me.bindField("mute", onMuteChange);
      me.bindField("solo", onSoloChange);

      if(me.data.getVal("ownerId") === 0) {
        me.root.find(".username").editable(function(value, settings) {
          me.data.setVal("name", value);
        }, {
          type: "text",
          submit: "OK"
        });
      }


      me.root.find("[name=mute]").bind("mousedown", function(event) {
        event.preventDefault();

        var val = me.data.getVal("mute");
        me.data.setVal("mute", !val);
      });
    },

    draw: function() {
      var me = this,
          data = me.data,
          el = $("#canvas");

      var template = $("#userInfoTemplate").html();
      me.root = $(template).appendTo(el).css({
        top: me.ypos
      });
    }
  });

  return UserView;
}());

