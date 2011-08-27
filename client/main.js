var paper;

function main() {
	paper = Raphael('canvas', 980, 600);

	var myEffectsData1 = new EffectsData(0);

	var effectsBox1 = new EffectsBox(250, 250, 48, 48, 0, myEffectsData1);

	var myEffectsData2 = new EffectsData(1);
	var effectsBox2 = new EffectsBox(400, 400, 48, 48, 1, myEffectsData2);

	effectsBoxRegistry.boxes.push(effectsBox1, effectsBox2);
}