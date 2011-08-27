/*globals EventEmitter: true, $: true */
// A user model.  The model is an object.  Every time data is changed in the
// model, an update event is emitted with the name of the item that has
// changed.
var Model = (function() {

  var Model = function(config) {
    if(config) {
      this.init(config);
    }
  };

  Model.prototype = new EventEmitter();
  $.extend(Model.prototype, {
    constructor: Model,

    init: function(config) {
      this.values = {};

      $.extend(this, config);
    },

    // val: value to be set
    // ind: index of the value to be set
    // shouldUpdate: whether or not the UI should receive an update notification
    setVal: function(key, val, shouldUpdate) {
      var me = this;

      if(val !== me.values[key]) {
        me.values[key] = val;
        if (shouldUpdate !== false) {
          me.emit("update", key, val);
          me.emit("update:" + key, key, val);
        }
      }
    },

    // gets an individual value
    getVal: function(key) {
      return this.values[key];
    }

  });


  return Model;

}());
