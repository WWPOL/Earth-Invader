var currentcanvas;

function initMainMenu() {
	var canvas = document.getElementById('mainmenu');
	var currentcanvas = canvas;
	var ctx = canvas.getContext('2d');
	winwitdh = document.documentElement.clientWidth;
	winheight = document.documentElement.clientHeight;
	canvas.width = winwitdh;
	canvas.height = winheight;

	ctx.font = "20pt Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("Earth Invader", winwitdh / 2, winheight / 2);

	var elements = [];
	elements.push({
		color: "red",
		width: 200,
		height: 75,
		top: winheight / 2 + 50,
		left: winwitdh / 2 - 100
	});
	elements.forEach(function(element) {
		ctx.fillStyle = element.color;
		ctx.fillRect(element.left, element.top, element.width, element.height);
	});
	ctx.fillStyle = "black";
	ctx.fillText("Start", winwitdh / 2, winheight / 2 + 100);

	canvas.addEventListener('click', function(event) {
		var cLeft = canvas.offsetLeft;
		var cTop = canvas.offsetTop;
		var x = event.pageX - cLeft;
		var y = event.pageY - cTop;

		elements.forEach(function(element) {
			if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				initLevelSelect();
			}
		});
	}, false);
}

function initLevelSelect() {
	var canvas = document.getElementById('levelselect');
	var currentcanvas = canvas;
	var ctx = canvas.getContext('2d');
	winwitdh = document.documentElement.clientWidth;
	winheight = document.documentElement.clientHeight;
	canvas.width = winwitdh;
	canvas.height = winheight;

	ctx.font = "20pt Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("Level Select", winwitdh / 2, winheight / 2);
}

function initGame() {
	var canvas = document.getElementById('game');
	var currentcanvas = canvas;
	var ctx = canvas.getContext('2d');
	winwitdh = document.documentElement.clientWidth;
	winheight = document.documentElement.clientHeight;
	canvas.width = winwitdh;
	canvas.height = winheight;
}

function resize() {
	console.log(currentcanvas);
	currentcanvas.width = document.documentElement.clientWidth;
	currentcanvas.height = document.documentElement.clientHeight;
}