/*globals EventEmitter: true, $: true */
// A generic model.  The model is an array.  Every time data is changed in the
// model, an update event is emitted with the index of the item that changed as
// well as the value.
var Model = (function() {

  var Model = function() {
    this.values = [];
  };

  Model.prototype = new EventEmitter();
  $.extend(Model.prototype, {
    constructor: Model,

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
      this.values[ind] = val;
      if (shouldUpdate !== false) {
        this.emit("update", ind, val);
        this.updateUI();
      }
    },

    // gets an individual value
    getVal: function(ind) {
      return this.values[ind];
    },

    // gets all values
    getAll: function() {
      return this.values;
    },

    // copy the given values, copy into locations starting at ind.
    // values - values to copy in.
    // ind - index in the current data where to start copying into.
    copy: function(values, ind) {
      for (var i=0, value; value = values[i]; i++) {
        var shouldUpdate = this.currentIndex == ind;
        this.setVal(value, i+ind, shouldUpdate);
      }
    }
  });


  return Model;

}());
