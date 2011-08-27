var paper;

function main() {
	paper = Raphael('canvas', 980, 600);
	var rect1 = paper.rect(250, 250, 48, 48, 10);
    rect1.attr({
		fill: '#ffffff'
	});


  var notesbox = new NotesBox();
  notesbox.init({
    paper: paper,
    startX: 0,
    startY: 0
  });

  notesbox.draw();
}
