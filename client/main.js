(function() {
  var MEASURES = 8,
      MEASURE_MARGIN = 10,
      LEFT_MARGIN = 265,
      BOX_OUTER_WIDTH = 48,
      BOX_OUTER_HEIGHT = 48,
      BOX_INNER_WIDTH = 36,
      BOX_INNER_HEIGHT = 36;

  function main() {
    window.paper = Raphael('canvas', 980, 600);

    createUser(0, 0);
    createUser(1, 1);

    var effectsData1 = new EffectsData(0);

    var effectsStart = 192;
    for (var i=0; i<MEASURES; i++) {
      var effectsBox1 = new
      EffectsBox(LEFT_MARGIN+(BOX_OUTER_WIDTH + MEASURE_MARGIN)*i, 250,
        BOX_OUTER_WIDTH, BOX_OUTER_HEIGHT, i, effectsData1);
      effectsBoxRegistry.boxes.push(effectsBox1);
    }

    var effectsData2 = new EffectsData(1);
    var effectsBox2 = new EffectsBox(400, 400, BOX_OUTER_WIDTH,
      BOX_OUTER_HEIGHT, 0, effectsData2);

    for (var i=0; i<effectsData2.notesPerBox*effectsData2.unitsPerNote; i++) {
      var percent = i/(effectsData2.notesPerBox*effectsData2.unitsPerNote);
      effectsData2.values[i] = [percent, percent];
    }

    effectsBoxRegistry.boxes.push(effectsBox2);

    function effectsTick() {
      effectsData1.tick();
      var t = setTimeout(effectsTick, 10);
    }

    effectsTick();
  }


  function createUser(ownerId, rowIndex) {
    var notesData = new Model({
      ownerId: ownerId
    });

    for (var i = 0; i < MEASURES; ++i) {
      var measureBox = new NotesBox({
        data: notesData,
        ind: i * 4,
        paper: paper,
        xpos: LEFT_MARGIN + i * (48 + MEASURE_MARGIN),
        ypos: 50 + (rowIndex * (50 + 20)),
        width: BOX_OUTER_WIDTH,
        height: BOX_OUTER_HEIGHT,
        innerWidth: BOX_INNER_WIDTH,
        innerHeight: BOX_INNER_HEIGHT
      });
		  effectsBoxRegistry.boxes.push(measureBox);
    }

  }

  window.main = main;

  $(main);
}());
