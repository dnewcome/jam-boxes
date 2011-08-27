(function() {
  var MEASURES = 8,
      MEASURE_MARGIN = 10,
      LEFT_MARGIN = 50,
      BOX_OUTER_WIDTH = 48,
      BOX_OUTER_HEIGHT = 48,
      BOX_INNER_WIDTH = 36,
      BOX_INNER_HEIGHT = 36;

  function main() {
    window.paper = Raphael('canvas', 980, 600);

    var model = new Model();

    for (var i = 0; i < MEASURES; ++i) {
      new NotesBox({
        model: model,
        modelOffset: i * 4,
        paper: paper,
        xpos: LEFT_MARGIN + i * (48 + MEASURE_MARGIN),
        ypos: 30,
        width: BOX_OUTER_WIDTH,
        height: BOX_OUTER_HEIGHT,
        innerWidth: BOX_INNER_WIDTH,
        innerHeight: BOX_INNER_HEIGHT
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
