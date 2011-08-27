(function() {
  var MEASURES = 8,
      NOTES_PER_MEASURE = 4,
      TOTAL_BEATS = MEASURES * NOTES_PER_MEASURE,
      MEASURE_MARGIN = 10,
      CANVAS_WIDTH = 980,
      BOX_OUTER_WIDTH = 60,
      BOX_OUTER_HEIGHT = 60,
      BOX_INNER_WIDTH = 48,
      BOX_INNER_HEIGHT = 48,
      LEFT_MARGIN = (CANVAS_WIDTH - (MEASURES * (BOX_OUTER_WIDTH + MEASURE_MARGIN))) / 2;

  function main() {
    window.paper = Raphael('canvas', CANVAS_WIDTH, 600);

    createUser(0, 0);
    var fakeData = [];
    for (var i = 0; i < TOTAL_BEATS; ++i) {
      fakeData[i] = ~~(Math.random() * 10);
    }
    createUser(1, 1, fakeData);

    var effectsData2 = new EffectsData(1, MEASURES, NOTES_PER_MEASURE);
    var effectsBox2 = new EffectsBox(400, 400, BOX_OUTER_WIDTH,
      BOX_OUTER_HEIGHT, 0, effectsData2);

    for (var i=0; i<effectsData2.notesPerBox*effectsData2.unitsPerNote; i++) {
      var percent = i/(effectsData2.notesPerBox*effectsData2.unitsPerNote);
      effectsData2.values[i] = [percent, percent];
    }

    effectsBoxRegistry.boxes.push(effectsBox2);

    function effectsTick() {
      $(window).trigger('tick');
      var t = setTimeout(effectsTick, 10);
    }

    effectsTick();
  }


  function createUser(ownerId, rowIndex, noteData, effectsData) {
    var notesModel = createNotesModel(ownerId, noteData),
        effectsModel = createEffectsModel(ownerId, effectsData),
        ypos = getYPos(rowIndex);

    for (var i = 0; i < MEASURES; ++i) {
      var xpos = getXPos(i);
      createMeasureNotesView(notesModel, i, xpos, ypos);
      createMeasureEffectsView(effectsModel, i, xpos, ypos);
    }
  }


  function createNotesModel(ownerId, noteData) {
    var noteModelConfig = {
      ownerId: ownerId,
      copySize: NOTES_PER_MEASURE
    };

    if(noteData) {
     noteModelConfig.values = noteData;
    }

    return new Model(noteModelConfig);
  }

  function createMeasureNotesView(notesModel, i, xpos, ypos) {
    var measureBox = new NotesBox({
      dndManager: notesBoxDNDManager,
      data: notesModel,
      ind: i * NOTES_PER_MEASURE,
      notesPerMeasure: NOTES_PER_MEASURE,
      paper: paper,
      xpos: xpos,
      ypos: ypos,
      width: BOX_OUTER_WIDTH,
      height: BOX_OUTER_HEIGHT,
      innerWidth: BOX_INNER_WIDTH,
      innerHeight: BOX_INNER_HEIGHT
    });
    notesBoxRegistry.boxes.push(measureBox);

    return measureBox;
  }

  function createEffectsModel(ownerId, effectsData) {
    // TODO - make use of the effectsData once we have it.
    return new EffectsData(ownerId, MEASURES, NOTES_PER_MEASURE);
  }

  function createMeasureEffectsView(effectsModel, i, xpos, ypos) {
    var effectsBox = new EffectsBox(
      xpos,
      ypos + BOX_OUTER_HEIGHT + MEASURE_MARGIN,
      BOX_OUTER_WIDTH,
      BOX_OUTER_HEIGHT,
      i,
      effectsModel);
    effectsBoxRegistry.boxes.push(effectsBox);

  }

  function getYPos(rowIndex) {
    return (rowIndex * (2 * (BOX_OUTER_HEIGHT +
              2*MEASURE_MARGIN)) + 70);
  }

  function getXPos(colIndex) {
    return LEFT_MARGIN + colIndex * (BOX_OUTER_WIDTH + MEASURE_MARGIN);
  }

  $(main);
}());
