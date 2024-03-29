/*globals Raphael: true, Model: true, ArrayModel: true, NotesBox: true, EffectsData: true, EffectsBox: true, paper: true, notesBoxDNDManager: true, notesBoxRegistry: true, effectsBoxRegistry: true, UserModel: true*/

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {

    if (typeof this !== "function") // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP ? this : oThis || window,
            aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };

}

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

	ae.registerMuteSoloEmitter(userModel);
    return userModel;
  }

  function createUserView(userModel, ypos) {
    var view = new UserView({
      data: userModel,
      ypos: (ypos + 20) + 'px'
    });
  }

  function getYPos(rowIndex) {
    return (rowIndex * (2 * (BOX_OUTER_HEIGHT + 2*MEASURE_MARGIN)) + 90);
  }

  function getXPos(colIndex) {
    return LEFT_MARGIN + colIndex * (BOX_OUTER_WIDTH + MEASURE_MARGIN);
  }

  function createUser(userData) {
  	var that = this,
        // Yes, this is right, we always want the first user created to be the
        // local user.
        ownerId = userCount,
        noteData = userData.notes,
        notesModel = createNotesModel(ownerId, noteData),
        effectsData = userData.effects,
        effectsModel = createEffectsModel(ownerId, effectsData),
        userModel = createUserModel(ownerId, userData),
        rowIndex = userCount,
        ypos = getYPos(rowIndex);

    userCount++;

    // Keep these so that we can update them later when we get new user data,
    // we have to update the model so that the updates are reflected in the UI.
    userModel.effectsModel = effectsModel;
    userModel.notesModel = notesModel;

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

    return userModel;
  }


  function main() {
    window.paper = Raphael('canvas', CANVAS_WIDTH, 700);

    var users = {};

    var network = new Network();
    network.on("localuserjoined", function(data) {
      users.local.setVal("userid", data.userid);
    });

    network.on("userupdate", function(userData) {
      var userid = userData.userid;
      var model = users[userid];
      if(model) {
        // update model
        model.updateFromData(userData);
      }
      else {
        model = createUser(userData);
        users[userid] = model;
      }
    });

    var userNotes = [
		1,null,null,null,
		1,null,null,null,
		1,null,null,null,
		1,3,null,null,
		1,null,null,null,
		1,null,null,null,
		1,null,null,null,
		1,5,null,null
	];
    var effectsData = [];
	for( var i=0; i < 256; i++ ) {
		var x = Math.sin(i*1/256/2*Math.PI);
		var y = Math.cos(i*1/256/2*Math.PI);
		effectsData.push( [ x, y ] );
	}

	  // this is global... FIXME
    userData = {
      ownerId: 0,
      name: 'Enter your name',
      mute: false,
      solo: true,
      notes: userNotes,
      effects: effectsData
    };
    model = createUser(userData);
    users.local = model;

  if(!model.getVal("returning")) {

    $('#lightbox').show();
    $('#headphones').show();

    setTimeout(function() {
      $('#headphones').fadeOut(1000, function() {

        $('#instructions').show();

        function removeInstructions() {
          $('#instructions').fadeOut(1000, function() {
            $('#instructions01').show();
          });
          $('body').bind('click', removeInstructions2);
        }


        function removeInstructions2() {
          $('#instructions01').fadeOut(1000, function() {
            $('#lightbox').hide();
          });
        }

        $('body').bind('click', removeInstructions);
      });
    }, 1000);
  }


	var svgstartbutton = new TransportButton( {
      text: 'Start',
      onclick: function() { ae.start(); },
      color: '90-#00ff00-#f8ff8d',
      paper: paper,
      xpos: 12,
      ypos: 10,
      width: BOX_OUTER_WIDTH*2,
      height: BOX_OUTER_HEIGHT,
      innerWidth: BOX_INNER_WIDTH,
      innerHeight: BOX_INNER_HEIGHT
	} );

	var svgstopbutton = new TransportButton( {
      text: 'Stop',
      onclick: function() { ae.stop(); },
      color: '90-#f10014-#f8ff8d',
      paper: paper,
      xpos: 158,
      ypos: 10,
      width: BOX_OUTER_WIDTH*2,
      height: BOX_OUTER_HEIGHT,
      innerWidth: BOX_INNER_WIDTH,
      innerHeight: BOX_INNER_HEIGHT
	} );

  }


  if($.browser.ie && parseInt($.browser.version, 10) < 10) {
    $('#ieSupport').show();
    return;
  }
  else if(!$.browser.mozilla) {
    $('#noSupport').show();
  }

  $(main);

}());
