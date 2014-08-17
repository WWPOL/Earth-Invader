var mouseX = 0; //global mouse coords
var mouseY = 0;

gc.addEventListener("mousemove", function (evt) {
	var rect = gc.getBoundingClientRect(); //get bounding rectangle
	mouseX = evt.clientX - rect.left;
	mouseY = evt.clientY - rect.top; //clientX & Y are for whole window, left and top are offsets
});

window.addEventListener('keydown', function(e) {
	keysDown[e.keyCode] = true;
});

window.addEventListener('keyup', function(e) {
	delete keysDown[e.keyCode];
});