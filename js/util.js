//Commonly used stuff, such as finding distance
function distance (x1,y1,x2,y2) {
	dX2 = Math.pow((x2-x1),2);
	dY2 = Math.pow((y2-y1),2);
	return Math.sqrt(dX2 + dY2);
} 

function collision (a,b) {
	space = a.radius + b.radius;
	if (distance(a.x,a.y,b.x,b.y) < space) {
		return true; //collision
	}
	else {
		return false;
	}
}

function resize() {
	if (currentcanvas === 'mm') {
		initMainMenu();
	} else if (currentcanvas === 'ls') {
		initLevelSelect();
	} else if (currentcanvas === 'gc') {
		initGame();
	}
}

var clicksound = function(){
	var clicksnd = new Audio();
	clicksnd.src = 'assets/click.wav';
	clicksnd.volume = Options.volume;
	clicksnd.play();
}
