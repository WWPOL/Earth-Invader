//Variable to Save active canvas, for purpose of resizing with screen resize
var currentcanvas;
var keysDown = {};
var mouseX = 0; //global mouse coords
var mouseY = 0;

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
	if(! (this.target === undefined)){
		this.targetX = this.target.x;
		this.targetY = this.target.y;

		// Calculate direction towards player
		var toPlayerX = this.targetX - this.x;
		var toPlayerY = this.targetY - this.y;

		// Normalize
		var toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
		toPlayerX = toPlayerX / toPlayerLength;
		toPlayerY = toPlayerY / toPlayerLength;

		this.rotation = Math.atan2(toPlayerY, toPlayerX);

		var approach = true; // tracks if enemy is currently approaching player
		//Move towards the player
		if (toPlayerLength > 55){
			this.angle = Math.atan2(toPlayerY,toPlayerX)+Math.PI;
			this.x += toPlayerX * this.speed;
			this.y += toPlayerY * this.speed;
			//approach = true;

		}//Move away from player
		else if (toPlayerLength < 45){
			this.angle = Math.atan2(toPlayerY, toPlayerX)+Math.PI;
			this.x -= toPlayerX * this.speed * 2;
			this.y -= toPlayerY * this.speed * 2;
			//approach = true;

		}//orbit
		else{
			this.angle -= 0.02;//Math.acos(1-Math.pow(3/toPlayerLength,2)/2);

			this.x = ((toPlayerLength * Math.cos(this.angle)) + (this.target.x));

			this.y = ((toPlayerLength * Math.sin(this.angle)) + (this.target.y));
			
		}

		//console.log(this.angle);
	}
};

//As it sounds, draw the enemy object
Enemy.prototype.draw = function(ctx) {
	ctx.save();
	ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
	ctx.rotate(this.rotation);
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.fillRect(this.x - (this.x + this.width/2), this.y - (this.y + this.height/2), this.width, this.height);
	ctx.restore();
};

//Init the player/turret
Turret = function (x,y) {
	this.x = x; 
	this.y = y;
	this.speed = 200;
	this.health = 1000; //balance parameter
	this.direction = 0; //radians

	this.updateArray = [0,0,0]; //x, y, health - all need to be done externally, event-based. Will only be set to non-0 if collision or appropriate keypress occurs

}

Turret.prototype.update = function (delta, gc) { //call this to update properties and draw
	//console.log(this.updateArray);

	if (65 in keysDown) { //left
		if (this.x > 0) {
			this.x -= this.speed * delta;
		}
	}
	if (87 in keysDown) { //up
		if (this.y > 0) {
			this.y -= this.speed * delta;
		}
	}
	if (68 in keysDown) { //right
		if (this.x < gc.width - 20) {
			this.x += this.speed * delta;
		}
	}
	if (83 in keysDown) { //down
		if (this.y < gc.height - 20) {
			this.y += this.speed * delta;
		}
	}

	var dHealth = this.updateArray[2]; //change in health
	var dDir = this.findDirection(mouseX,mouseY); //delta in direction


	this.direction += dDir;
	this.health += dHealth;

	//turret.draw(this.x,this.y,this.direction); //draw first (keep old variables to clear out)

	//at end, clear updateArray
	this.updateArray = [0,0,0];
}

Turret.prototype.draw = function (ctx) { 
	ctx.save(); //save the state to stack before rotating
	ctx.fillStyle = "#000000";		
	ctx.translate(this.x,this.y);
	ctx.rotate(this.direction);
	ctx.beginPath();
	ctx.fillRect(-10,-5,20,10);
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(-15,-1,10,2);
	ctx.closePath();
	ctx.restore(); //restore back to original
}

Turret.prototype.findDirection = function (mX,mY) {
	var distanceX = this.x - mX;
	var distanceY = this.y - mY;
	var newDir = Math.atan2(distanceY,distanceX); //find angle from arctangent
	//console.log(newDir*180/Math.PI - this.direction);
	var dDir = newDir - this.direction; //delta in direction
	return dDir;
}

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

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

//Because of issues with the files loading asynchronously and sometimes before the document was ready, I was forced to merge the three other files and encase them in an init function
function initGame() {
	//Initialize the game canvas, get its context, and set its width and height to that of the screen
	var gamecanvas = document.getElementById("game");
	var gamectx = gamecanvas.getContext("2d");
	gamecanvas.width = document.documentElement.clientWidth;
	gamecanvas.height = document.documentElement.clientHeight;

	//Create a target, an enemy, and assign the target to enemy so that it will follow it
	var target = new Turret(20, 20);
	var test = new Enemy(600, 400, 20, 20);
	test.assignTarget(target);

	window.addEventListener("mousemove", function (evt) {
		var rect = gamecanvas.getBoundingClientRect(); //get bounding rectangle
		mouseX = evt.clientX - rect.left;
		mouseY = evt.clientY - rect.top; //clientX & Y are for whole window, left and top are offsets
	});

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
		test.update(delta, gamecanvas);
		target.update(delta, gamecanvas);
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

		test.draw(gamectx);
		target.draw(gamectx);
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