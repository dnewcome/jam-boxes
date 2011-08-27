var paper;

function main() {
	paper = Raphael('canvas', 980, 600);
	var rect1 = paper.rect(250, 250, 48, 48, 10);
    rect1.attr({
		fill: '#ffffff'
	});
  new NotesBox({
    paper: paper,
    startX: 0,
    startY: 0
  });

}