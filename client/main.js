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
      UNITS_PER_NOTE = 8,
      LEFT_MARGIN = (CANVAS_WIDTH - (MEASURES * (BOX_OUTER_WIDTH + MEASURE_MARGIN))) / 2;

  var userCount = 0;

  function createNotesModel(ownerId, noteData) {
    var noteModelConfig = {
      ownerId: ownerId,
      copySize: NOTES_PER_MEASURE,
      timer: ae,
      numValues: NOTES_PER_MEASURE*MEASURES,
      numUnits: UNITS_PER_NOTE,
      totalTicks: MEASURES*NOTES_PER_MEASURE*UNITS_PER_NOTE
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
    return new EffectsData(effectsData, ownerId, MEASURES, NOTES_PER_MEASURE, ae);
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
      ypos: (ypos + 20) + 'px'
    });
  }

  function getYPos(rowIndex) {
    return (rowIndex * (2 * (BOX_OUTER_HEIGHT + 2*MEASURE_MARGIN)) + 70);
  }

  function getXPos(colIndex) {
    return LEFT_MARGIN + colIndex * (BOX_OUTER_WIDTH + MEASURE_MARGIN);
  }

  function createUser(userData) {
  	var that = this;
    var ownerId = userData.ownerId,
        noteData = userData.notes,
        notesModel = createNotesModel(ownerId, noteData),
        effectsData = userData.effects,
        effectsModel = createEffectsModel(ownerId, effectsData),
        userModel = createUserModel(ownerId, userData),
        rowIndex = userCount,
        ypos = getYPos(rowIndex);

    userCount++;

    createUserView(userModel, ypos);

    this.effectsController = createEffectsController(effectsModel,
      getXPos(MEASURES)+MEASURE_MARGIN, ypos);

    if (ownerId === 0) {
      $(window).bind("mouseup", that.effectsController.onMouseUp);
    }

    for (var i = 0; i < MEASURES; ++i) {
      var xpos = getXPos(i);
      createMeasureNotesView(notesModel, i, xpos, ypos);
      createMeasureEffectsView(effectsModel, i, xpos, ypos);
    }

    // ae is the audio engine instance
    ae.addSequence(SAMPLES[rowIndex], noteData);
    ae.addEffectsData(SAMPLES[rowIndex], effectsData);
  }


  function createEditableEffectsBox(effectsData) {
    var effectsData = new EffectsData(effectsData, 0, MEASURES, NOTES_PER_MEASURE, ae);
    var effectsBox = new EffectsBox(400, 400, BOX_OUTER_WIDTH,
      BOX_OUTER_HEIGHT, 0, effectsData);

    for (var i=0; i<effectsData.notesPerBox*effectsData.unitsPerNote; i++) {
      var percent = i/(effectsData.notesPerBox*effectsData.unitsPerNote);
      effectsData.values[i] = [percent, percent];
    }

    effectsBoxRegistry.boxes.push(effectsBox);
  }

  function main() {
    window.paper = Raphael('canvas', CANVAS_WIDTH, 600);

    var users = {};

    var network = new Network();
    network.on("userupdate", function(userData) {
      var model = users[userData.userid];
      if(!model) {
        createUser(userData);
        console.log('creating user');
        users[userData.userid] = 1;
      }
      else {
        console.log("updating user");
        // update model
      }
    });

    var userNotes = [];
    var effectsData = [];

	// this is global... FIXME
    userData = {
      ownerId: 0,
      name: 'Jeremy',
      mute: false,
      solo: true,
      notes: userNotes,
      effects: effectsData
    };
    createUser(userData );

    createEditableEffectsBox(effectsData);

	var headphones = paper.image("headphones.png", CANVAS_WIDTH/2-300/2, 0, 300, 300);
	setTimeout(function() {
		headphones.animate({opacity: 0.0}, 3000, "<");
	}, 1000);
  }

  $(main);
}());
