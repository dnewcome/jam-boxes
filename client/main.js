/*globals Raphael: true, Model: true, ArrayModel: true, NotesBox: true, EffectsData: true, EffectsBox: true, paper: true, notesBoxDNDManager: true, notesBoxRegistry: true, effectsBoxRegistry: true, UserModel: true*/
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

  function createNotesModel(ownerId, noteData) {
    var noteModelConfig = {
      ownerId: ownerId,
      copySize: NOTES_PER_MEASURE
    };

    if(noteData) {
      noteModelConfig.values = noteData;
    }

    return new ArrayModel(noteModelConfig);
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

  function createEffectsController(effectsModel, xpos, ypos) {
  	return new EffectsController(xpos, ypos, BOX_OUTER_WIDTH*2+MEASURE_MARGIN, BOX_OUTER_HEIGHT*2+MEASURE_MARGIN, effectsModel);
  }

  function createUserModel(ownerId, userData) {
    var userModel = new UserModel({
      values: userData
    });

    return userModel;
  }

  function createUserView(userModel, ypos) {
    var view = new UserView({
      data: userModel,
      ypos: (ypos + BOX_OUTER_HEIGHT - 10) + 'px'
    });
  }

  function getYPos(rowIndex) {
    return (rowIndex * (2 * (BOX_OUTER_HEIGHT + 2*MEASURE_MARGIN)) + 70);
  }

  function getXPos(colIndex) {
    return LEFT_MARGIN + colIndex * (BOX_OUTER_WIDTH + MEASURE_MARGIN);
  }

  function createUser(rowIndex, userData) {
  	var that = this;
    var ownerId = userData.ownerId,
        noteData = userData.notes,
        notesModel = createNotesModel(ownerId, noteData),
        effectsData = userData.effects,
        effectsModel = createEffectsModel(ownerId, effectsData),
        userModel = createUserModel(ownerId, userData),
        ypos = getYPos(rowIndex);

    createUserView(userModel, ypos);

	this.effectsController = createEffectsController(effectsModel, getXPos(MEASURES)+MEASURE_MARGIN, ypos);

	if (ownerId === 0) {
		$(window).bind("mouseup", that.effectsController.onMouseUp);
	}

    for (var i = 0; i < MEASURES; ++i) {
      var xpos = getXPos(i);
      createMeasureNotesView(notesModel, i, xpos, ypos);
      createMeasureEffectsView(effectsModel, i, xpos, ypos);
    }
  }


  function createEditableEffectsBox() {
    var effectsData = new EffectsData(1, MEASURES, NOTES_PER_MEASURE);
    var effectsBox = new EffectsBox(400, 400, BOX_OUTER_WIDTH,
      BOX_OUTER_HEIGHT, 0, effectsData);

    for (var i=0; i<effectsData.notesPerBox*effectsData.unitsPerNote; i++) {
      var percent = i/(effectsData.notesPerBox*effectsData.unitsPerNote);
      effectsData.values[i] = [percent, percent];
    }

    effectsBoxRegistry.boxes.push(effectsBox);
  }

  function startTick() {
    function effectsTick() {
      $(window).trigger('tick');
    }

    effectsTick();
    setInterval(effectsTick, 10);
  }

  function main() {
    window.paper = Raphael('canvas', CANVAS_WIDTH, 600);

    createUser(0, {
      ownerId: 0,
      name: 'Jeremy',
      mute: false,
      solo: true,
      notes: {},
      effects: {}
    });

    var fakeNoteData = [], i;
    for (i = 0; i < TOTAL_BEATS; ++i) {
      fakeNoteData[i] = ~~(Math.random() * 10);
    }
    createUser(1, {
      ownerId: 1,
      name: 'Dan',
      mute: false,
      solo: false,
      notes: fakeNoteData,
      effects: {}
    });

    createEditableEffectsBox();
    startTick();
  }

  $(main);
}());
