(function() {
  var MEASURES = 8;
  var MEASURE_MARGIN = 10;
  var LEFT_MARGIN = 50;

  function main() {
    window.paper = Raphael('canvas', 980, 600);

    var model = new Model();

    for (var i = 0; i < MEASURES; ++i) {
      new NotesBox({
        model: model,
        modelOffset: i * 4,
        paper: paper,
        xpos: LEFT_MARGIN + i * (48 + MEASURE_MARGIN),
        ypos: 30
      });
    }

    var effectsData1 = new EffectsData(0);

    var effectsBox1 = new EffectsBox(250, 250, 48, 48, 0, effectsData1);

    var effectsData2 = new EffectsData(1);
    var effectsBox2 = new EffectsBox(400, 400, 48, 48, 1, effectsData2);

    for (var i=0; i<effectsData2.numValues; i++) {
      effectsData2.values[i] = [0.1, 0.1];
    }

    effectsBoxRegistry.boxes.push(effectsBox1, effectsBox2);
  }

  window.main = main;
}());
