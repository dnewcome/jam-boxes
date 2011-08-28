/**globals Model: true */

// represents a user
var UserModel = (function() {
  var UserModel = function() {
    Model.prototype.constructor.apply(this, arguments);
  };
  UserModel.prototype = new Model();
  $.extend(UserModel.prototype, {
    constructor: UserModel,
    init: function(config) {
      var me=this;
      if(!config.values.ownerId) {
        me.on("update:name", me.onLocalUserNameChange.bind(me));

        var values = config.values;
        if(localStorage.localUserName) {
          values.name = localStorage.localUserName;
        }
      }
      Model.prototype.init.call(me, config);
    },

    updateFromData: function(data) {
      var me=this;

      me.setVal("name", data.name);
      me.setVal("userid", data.userid);
      me.notesModel.copy(0, data.notes);
      me.effectsModel.copy(0, data.effects);
    },

    onLocalUserNameChange: function(key, name) {
      localStorage.localUserName = name;
    }
  });

  return UserModel;
}());
