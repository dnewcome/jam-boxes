(function() {
  var MEASURES = 8,
      NOTES_PER_MEASURE = 4,
      TOTAL_BEATS = MEASURES * NOTES_PER_MEASURE,
      MEASURE_MARGIN = 10,
      LEFT_MARGIN = 215,
      BOX_OUTER_WIDTH = 60,
      BOX_OUTER_HEIGHT = 60,
      BOX_INNER_WIDTH = 48,
      BOX_INNER_HEIGHT = 48;

  function main() {
    window.paper = Raphael('canvas', 980, 600);

    createUser(0, 0);
    var fakeData = [];
    for (var i = 0; i < TOTAL_BEATS; ++i) {
      fakeData[i] = ~~(Math.random() * 10);
    }
    createUser(1, 1, fakeData);

    var effectsData1 = new EffectsData(0, MEASURES, NOTES_PER_MEASURE);

    var effectsStart = 192;
    for (var i=0; i < MEASURES; i++) {
      var effectsBox1 = new
      EffectsBox(LEFT_MARGIN+(BOX_OUTER_WIDTH + MEASURE_MARGIN)*i, 250,
        BOX_OUTER_WIDTH, BOX_OUTER_HEIGHT, i, effectsData1);
      effectsBoxRegistry.boxes.push(effectsBox1);
    }

    var effectsData2 = new EffectsData(1, MEASURES, NOTES_PER_MEASURE);
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


  function createUser(ownerId, rowIndex, data) {
    var modelParams = {
      ownerId: ownerId,
      getWidth: NOTES_PER_MEASURE
    };

    if(data) {
      modelParams.values = data;
    }
    var notesData = new Model(modelParams);

    for (var i = 0; i < MEASURES; ++i) {
      var measureBox = new NotesBox({
      	dndManager: notesBoxDNDManager,
        data: notesData,
        ind: i * NOTES_PER_MEASURE,
        notesPerMeasure: NOTES_PER_MEASURE,
        paper: paper,
        xpos: LEFT_MARGIN + i * (BOX_OUTER_WIDTH + MEASURE_MARGIN),
        ypos: BOX_OUTER_HEIGHT * 1.5 + (rowIndex * (BOX_OUTER_HEIGHT + 20)),
        width: BOX_OUTER_WIDTH,
        height: BOX_OUTER_HEIGHT,
        innerWidth: BOX_INNER_WIDTH,
        innerHeight: BOX_INNER_HEIGHT
      });
		  notesBoxRegistry.boxes.push(measureBox);
    }

  }

  window.main = main;

  $(main);
}());
