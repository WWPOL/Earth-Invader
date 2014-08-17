//Variable to Save active canvas, for purpose of resizing with screen resize
var currentcanvas;

//Inits the main menu, shows title and play button
function initMainMenu() {
	//This block initiliazes the mainmenu canvas, sets the context, and sets its width and height to that of the user's screen
	var canvas = document.getElementById('mainmenu');
	var currentcanvas = canvas;
	var ctx = canvas.getContext('2d');
	winwitdh = document.documentElement.clientWidth;
	winheight = document.documentElement.clientHeight;
	canvas.width = winwitdh;
	canvas.height = winheight;

	//Render the Title
	ctx.font = "20pt Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("Earth Invader", winwitdh / 2, winheight / 2);

	//Initialize Array of clickable elements, and then push in the parameters that would make a rectangle ***Note, this may be innefficient for just one element, consider revision
	var elements = [];
	elements.push({
		color: "red",
		width: 200,
		height: 75,
		top: winheight / 2 + 50,
		left: winwitdh / 2 - 100
	});

	//render each object in elements as per parameters
	elements.forEach(function(element) {
		ctx.fillStyle = element.color;
		ctx.fillRect(element.left, element.top, element.width, element.height);
	});

	//render text on the start button
	ctx.fillStyle = "black";
	ctx.fillText("Start", winwitdh / 2, winheight / 2 + 100);


	//Initialize click handler for start button. It checks every click on the canvas if it is in the bounds of any of the elements, in this case, the start button
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

//Initialize the level select menu. So far, it is basically just a main menu again, nothing new.
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
	ctx.fillText("Play", winwitdh / 2, winheight / 2 + 100);

	canvas.addEventListener('click', function(event) {
		var cLeft = canvas.offsetLeft;
		var cTop = canvas.offsetTop;
		var x = event.pageX - cLeft;
		var y = event.pageY - cTop;

		elements.forEach(function(element) {
			if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				initGame();
			}
		});
	}, false);
}

//Because of issues with the files loading asynchronously and sometimes before the document was ready, I was forced to merge the three other files and encase them in an init function
function initGame() {
	//Init the enemy class
	Enemy = function(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.cx = x + (this.width / 2);
		this.cy = y + (this.height / 2);
		this.speed = 3;

		//This allows for the enemy to rotate to face the player
		this.rotation = 0;
	};

	//Tells the enemy object which object to follow, in the actual game, it will be the player
	Enemy.prototype.assignTarget = function(target) {
		this.target = target;
	};

	//Update the enemey's position
	Enemy.prototype.update = function(delta) {
		if(this.target !== undefined){
			this.targetX = this.target.x;
			this.targetY = this.target.y;

			// Calculate direction towards player
			toPlayerX = this.targetX - this.x;
			toPlayerY = this.targetY - this.y;

			// Normalize
			toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
			toPlayerX = toPlayerX / toPlayerLength;
			toPlayerY = toPlayerY / toPlayerLength;


			//Move towards the player
			if (toPlayerLength > 55) {
				this.x += toPlayerX * this.speed;
				this.y += toPlayerY * this.speed;

				this.rotation = Math.atan2(toPlayerY, toPlayerX);
			} else if (toPlayerLength < 50) {
				this.x -= toPlayerX * this.speed;
				this.y -= toPlayerY * this.speed;

				this.rotation = Math.atan2(toPlayerY, toPlayerX);
			}
		}
	};

	//As it sounds, render the enemy object
	Enemy.prototype.render = function() {
		gamectx.save();
		gamectx.translate(this.x + this.width / 2, this.y + this.height / 2);
		gamectx.rotate(this.rotation);
		gamectx.beginPath();
		gamectx.fillStyle = "red";
		gamectx.fillRect(this.x - (this.x + this.width/2), this.y - (this.y + this.height/2), this.width, this.height);
		gamectx.restore();
	};

	//Initialize the target class, a class used for testing the enemy class's pathfinding. This class will later evolve into the Player class
	Target = function(x, y){
		this.x = x;
		this.y = y;
		this.speed = 500;
	};

	//Update the target based on keydown. Currently uses arrow keys for movement. ***Note: If space allows, use WASD for movement, space for fire, and make the player rotate to where the mouse is for finer aiming
	Target.prototype.update = function(delta) {
		if (37 in keysDown) { //left
			if (this.x > 0) {
				this.x -= this.speed * delta;
			}
		}
		if (38 in keysDown) { //up
			if (this.y > 0) {
				this.y -= this.speed * delta;
			}
		}
		if (39 in keysDown) { //right
			if (this.x < gamecanvas.width - 20) {
				this.x += this.speed * delta;
			}
		}
		if (40 in keysDown) { //down
			if (this.y < gamecanvas.height - 20) {
				this.y += this.speed * delta;
			}
		}

	};

	//Render the target object
	Target.prototype.render = function() {
		gamectx.beginPath();
		gamectx.fillStyle = "green";
		gamectx.fillRect(this.x, this.y, 20, 20);
		gamectx.stroke();
	};

	//Initialize the game canvas, get its context, and set its width and height to that of the screen
	var gamecanvas = document.getElementById("game");
	var gamectx = gamecanvas.getContext("2d");
	gamecanvas.width = document.documentElement.clientWidth;
	gamecanvas.height = document.documentElement.clientHeight;

	//Create a target, an enemy, and assign the target to enemy so that it will follow it
	var target = new Target(20, 20);
	var test = new Enemy(600, 400, 20, 20);
	test.assignTarget(target);

	//Add the eventlisteners for keydown/up so keys can be used
	var keysDown = {};
	window.addEventListener('keydown', function(e) {
		keysDown[e.keyCode] = true;
	});
	window.addEventListener('keyup', function(e) {
		delete keysDown[e.keyCode];
	});

	//main game loop, updates and renders the game
	var main = function(){
		var now = Date.now();
		var delta = now - then;

		update(delta / 1000);
		render();

		then = now;

		requestAnimationFrame(main);
	};

	//updates the positions of the target and enemy
	var update = function(delta){
		test.update(delta);
		target.update(delta);
	};

	//clears the screen
	var clearScreen = function(){
		gamectx.beginPath();
		gamectx.fillStyle = "white";
		gamectx.fillRect(0,0,gamecanvas.width, gamecanvas.height);
		gamectx.stroke();
	};

	//clears the screen, and redraws the objects
	var render = function(){
		clearScreen();

		test.render();
		target.render();
	};

	//updates the time, runs the main loop
	var then = Date.now();
	main();
}

//currently broken
function resize() {
	console.log(currentcanvas);
	currentcanvas.width = document.documentElement.clientWidth;
	currentcanvas.height = document.documentElement.clientHeight;
}