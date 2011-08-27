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

    var notesData = new Model();

    for (var i = 0; i < MEASURES; ++i) {
      var measureBox = new NotesBox({
        data: notesData,
        ind: i * 4,
        paper: paper,
        xpos: LEFT_MARGIN + i * (48 + MEASURE_MARGIN),
        ypos: 30,
        width: BOX_OUTER_WIDTH,
        height: BOX_OUTER_HEIGHT,
        innerWidth: BOX_INNER_WIDTH,
        innerHeight: BOX_INNER_HEIGHT
      });
		  effectsBoxRegistry.boxes.push(measureBox);
    }

	var effectsData1 = new EffectsData(0);

	var effectsStart = 192;
	for (var i=0; i<8; i++) {
		var effectsBox1 = new EffectsBox(effectsStart+4+(48+8)*i, 250, 48, 48, i, effectsData1);
		effectsBoxRegistry.boxes.push(effectsBox1);
	}

	var effectsData2 = new EffectsData(1);
	var effectsBox2 = new EffectsBox(400, 400, 48, 48, 0, effectsData2);

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

  window.main = main;
}());
