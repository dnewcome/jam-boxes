/**globals Model: true */

// represents a user
var UserModel = (function() {
  var UserModel = function() {
    Model.prototype.constructor.apply(this, arguments);
  };
  UserModel.prototype = new Model();
  $.extend(UserModel.prototype, {
    constructor: UserModel
  });

  return UserModel;
}());
