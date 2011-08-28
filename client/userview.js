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

	  this.setMute = function (isMute) {
	  	me.data.setVal("mute", isMute);
	  	
	  	me.data.emit("mute", me.data.getVal("ownerId"), isMute);
        if (isMute) {
        	me.root.find('.mute').removeClass('muteInactive');
        	me.root.find('.mute').addClass('muteActive');

			if (me.data.getVal("solo")) {
				me.setSolo(false);
			}
        }
        else {
      	    me.root.find('.mute').removeClass('muteActive');
        	me.root.find('.mute').addClass('muteInactive');
        }
	  };

	  this.setSolo = function(isSolo) {
	  	me.data.setVal("solo", isSolo);
	  	me.data.emit("solo", me.data.getVal("ownerId"), isSolo);
        if (isSolo) {
        	me.root.find('.solo').removeClass('soloInactive');
        	me.root.find('.solo').addClass('soloActive');

			if (me.data.getVal("mute")) {
				me.setMute(false);
			}
        }
        else {
      	    me.root.find('.solo').removeClass('soloActive');
        	me.root.find('.solo').addClass('soloInactive');
        }
	  }

	  me.root.find('.mute').bind("mousedown", function(event) {
//	  	event.preventDefault();
        var val = me.data.getVal("mute");
        var val = !val;	// toggle the value
        me.setMute(val);
	  });

	  me.root.find('.solo').bind("mousedown", function(event) {
	  	var val = me.data.getVal("solo");
        var val = !val;	// toggle the value
		me.setSolo(val);
	  });

      /*me.root.find("[name=mute]").bind("mousedown", function(event) {
        event.preventDefault();

        var val = me.data.getVal("mute");
        var val = !val;	// toggle the value
        me.data.setVal("mute", val);
        if (val) {
        	me.root.find("[name=mute]").id = 'muteActive';
        }
        else {
        	me.root.find("[name=mute]").id = 'muteInactive';
        }
      });*/
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

