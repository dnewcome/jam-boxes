/**globals Model: true */

// represents a user
var UserModel = (function() {
  var UserModel = function() {
    Model.prototype.constructor.apply(this, arguments);
  };
  UserModel.prototype = new Model();
  $.extend(UserModel.prototype, {
    constructor: UserModel,
    updateFromData: function(data) {
      var me=this;

      me.setVal("name", data.name);
      me.notesModel.copy(0, data.notes);
      me.effectsModel.copy(0, data.effects);
    }
  });

  return UserModel;
}());
