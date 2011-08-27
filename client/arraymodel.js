/*globals EventEmitter: true, $: true */
// A generic array model.  The model is an array.  Every time data is changed in the
// model, an update event is emitted with the index of the item that changed as
// well as the value.
var ArrayModel = (function() {

  var ArrayModel = function(config) {
    this.init(config);
  };

  ArrayModel.prototype = new EventEmitter();
  $.extend(ArrayModel.prototype, {
    constructor: ArrayModel,

    init: function(config) {
      this.values = [];

      $.extend(this, config);
    },

    // updates the UI. the UI element is responsible for determining
    // whether or not the current index should update the UI (i.e.
    // if there is an EffectsBox whose index range does not
    // include the currentIndex)
    updateUI: function(ind) {
      this.currentIndex = this.currentIndex+1;
    },

    // val: value to be set
    // ind: index of the value to be set
    // shouldUpdate: whether or not the UI should receive an update notification
    setVal: function(ind, val, shouldUpdate) {
      var me = this;

      if(val !== me.values[ind]) {
        me.values[ind] = val;
        if (shouldUpdate !== false) {
          me.emit("update", ind, val);
          me.updateUI();
        }
      }
    },

    // gets an individual value
    getVal: function(ind) {
      return this.values[ind];
    },

    // gets a set of values starting at ind
    getValues: function(ind) {
      var me = this,
          vals = [];
      for(var i = 0, val; i < me.copySize; ++i) {
        vals[i] = me.values[i+ind];
      }
      return vals;
    },

    // copy the given values, copy into locations starting at ind.
    // ind - index in the current data where to start copying into.
    // values - values to copy in.
    copy: function(ind, values) {
      var me = this,
          len = values.length;
      for( var index = 0, value; index < len; ++index ) {
        value = values[index];
        me.setVal(index+ind, value, true);
      }
    }
  });


  return ArrayModel;

}());
