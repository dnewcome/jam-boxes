var paper;

function main() {
	paper = Raphael('canvas', 980, 600);

  var model = new Model();
  new NotesBox({
    model: model,
    modelOffset: 0,
    paper: paper,
    xpos: 30,
    ypos: 30
  });

	var effectsData1 = new EffectsData(0);

	var effectsBox1 = new EffectsBox(250, 250, 48, 48, 0, effectsData1);

	var effectsData2 = new EffectsData(1);
	var effectsBox2 = new EffectsBox(400, 400, 48, 48, 1, effectsData2);

	for (var i=0; i<effectsData2.numValues; i++) {
		effectsData2.values[i] = [0.1, 0.1];
	}

	effectsBoxRegistry.boxes.push(effectsBox1, effectsBox2);
}
