///////////////// GLOBAL VARIABLES \\\\\\\\\\\\\\\\\
var currentcanvas;
var keysDown = {};
var mouseX = 0; //global mouse coords
var mouseY = 0;
/////////////////------------------\\\\\\\\\\\\\\\\\


///////////////// CLASSES \\\\\\\\\\\\\\\\\\\\\\\\\\
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
	this.damage = 100;

	this.updateArray = [0,0,0]; //x, y, health - all need to be done externally, event-based. Will only be set to non-0 if collision or appropriate keypress occurs

};

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
};

Turret.prototype.draw = function (ctx) { 
	ctx.save(); //save the state to stack before rotating
	ctx.fillStyle = "white";		
	ctx.translate(this.x,this.y);
	ctx.rotate(this.direction);
	ctx.beginPath();
	ctx.fillRect(-10,-5,20,10);
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(-15,-1,10,2);
	ctx.closePath();
	ctx.restore(); //restore back to original
};

Turret.prototype.findDirection = function (mX,mY) {
	var distanceX = this.x - mX;
	var distanceY = this.y - mY;
	var newDir = Math.atan2(distanceY,distanceX); //find angle from arctangent
	//console.log(newDir*180/Math.PI - this.direction);
	var dDir = newDir - this.direction; //delta in direction
	return dDir;
};

Planet = function(x, y) {
	this.x = x;
	this.y = y;
	this.health = 10000;
	this.damageTaken = 0;
}

Planet.prototype.update = function(delta) {
	this.health += this.damageTaken;
	this.damageTaken = 0;
}

Planet.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, 70, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#003300';
	ctx.stroke();
}

Star = function(x, y, color) {
	this.x = x;
	this.y = y;
	this.color = color;
}

Star.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI, false);
	ctx.fillStyle = this.color;
	ctx.fill();
}
/////////////////---------\\\\\\\\\\\\\\\\\\\\\\\\\\

///////////////// INIT FUNCTIONS \\\\\\\\\\\\\\\\\\\
//Inits the main menu, shows title and play button
function initMainMenu() {
	//This block initiliazes the mainmenu canvas, sets the context, and sets its width and height to that of the user's screen
	var canvas = document.getElementById('mainmenu');
	currentcanvas = 'mm';
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
	currentcanvas = 'ls';
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

function initStars() {
	var starcanvas = document.getElementById("stars");
	var starctx = starcanvas.getContext("2d");
	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	starcanvas.width = clientWidth;
	starcanvas.height = clientHeight;
	var stars = [];
	var colors = ["blue", "white", "red", "yellow"]
	for (var y = 0; y < clientHeight; y += Math.round(Math.random() * 100) + 1) {
		for (var x = 0; x < clientWidth; x += Math.round(Math.random() * 100) + 1) {
			var color = colors[Math.round(Math.random() * 4)];
			var star = new Star(x, y, color);
			stars.push(star);
		};
	}
	for (var x = 0; x < clientWidth; x += Math.round(Math.random() * 100) + 1) {
		for (var y = 0; y < clientHeight; y += Math.round(Math.random() * 100) + 1) {
			var color = colors[Math.round(Math.random() * 4)];
			var star = new Star(x, y, color);
			stars.push(star);
		};
	}
	//main game loop, updates and renders the game
	var main = function(){
		var now = Date.now();
		var delta = now - then;
		render();

		then = now;

		requestAnimationFrame(main);
	};

	//clears the screen
	var clearScreen = function(){
		starctx.beginPath();
		starctx.fillStyle = "black";
		starctx.fillRect(0,0,starcanvas.width, starcanvas.height);
		starctx.stroke();
	};

	//clears the screen, and redraws the objects
	var render = function(){
		clearScreen();
		stars.forEach(function(star){
			star.draw(starctx)
		});
	};

	//updates the time, runs the main loop
	var then = Date.now();
	main();
}

//Because of issues with the files loading asynchronously and sometimes before the document was ready, I was forced to merge the three other files and encase them in an init function
function initGame() {
	initStars();
	//Initialize the game canvas, get its context, and set its width and height to that of the screen
	var gamecanvas = document.getElementById("game");
	var gamectx = gamecanvas.getContext("2d");
	currentcanvas = 'gc';
	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	gamecanvas.width = clientWidth;
	gamecanvas.height = clientHeight;
	var halfwidth = gamecanvas.width / 2;
	var halfheight = gamecanvas.height / 2;

	var planet = new Planet(halfwidth, halfheight);
	var enemies = [];
	var defenders = [];

	//Create a target, an enemy, and assign the target to enemy so that it will follow it
	var target = new Turret(20, 20);
	var i = 0
	var makeEnemies = function() {
		var enemy = new Enemy(600, 400, 20, 20);
		var enemy2 = new Enemy(600, 400, 20, 20);
		enemy.assignTarget(planet);
		enemy2.assignTarget(target);
		defenders.push(enemy);
		enemies.push(enemy2);
		if (i < 7) {
			setTimeout(function(){
				makeEnemies();
			}, 1000);
			i += 1;
		}
	};
	makeEnemies();

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
		target.update(delta, gamecanvas);
		planet.update(delta);

		enemies.forEach(function(enemy){
			enemy.update(delta, gamecanvas)
		});
		defenders.forEach(function(enemy){
			enemy.update(delta, gamecanvas)
		});
	};

	//clears the screen
	var clearScreen = function(){
		gamectx.clearRect(0,0,gamecanvas.width, gamecanvas.height);
	};

	//clears the screen, and redraws the objects
	var render = function(){
		clearScreen();

		planet.draw(gamectx);
		enemies.forEach(function(enemy){
			enemy.draw(gamectx)
		});
		defenders.forEach(function(enemy){
			enemy.draw(gamectx)
		});
		target.draw(gamectx);
	};

	//updates the time, runs the main loop
	var then = Date.now();
	main();
}
/////////////////----------------\\\\\\\\\\\\\\\\\\\

///////////////// MISCELLANEOUS \\\\\\\\\\\\\\\\\\\\
function resize() {
	if (currentcanvas === 'mm') {
		initMainMenu();
	} else if (currentcanvas === 'ls') {
		initLevelSelect();
	} else if (currentcanvas === 'gc') {
		initGame();
	}
}
/////////////////---------------\\\\\\\\\\\\\\\\\\\\