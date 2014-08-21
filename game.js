///////////////// GLOBAL VARIABLES \\\\\\\\\\\\\\\\\
var currentcanvas;
var keysDown = {};
var mouseX = 0; //global mouse coords
var mouseY = 0;
/////////////////------------------\\\\\\\\\\\\\\\\\


///////////////// CLASSES \\\\\\\\\\\\\\\\\\\\\\\\\\
//Init the enemy class
Enemy = function(x, y, width, height, orbit, color){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.cx = x + (this.width / 2);
	this.cy = y + (this.height / 2);
	this.speed = 3;
	this.orbit = orbit; //property determining distance of orbit
	this.color = color;

	this.alive = true; //used for determining damage and whether to draw

	this.dmgtick = 0; //damage tick counter, used in Enemy.update() for determining damage to player
	//This allows for the enemy to rotate to face the player
	this.rotation = 0;
};

//Tells the enemy object which object to follow, in the actual game, it will be the player
Enemy.prototype.assignplayer = function(player) {
	this.player = player;
};

//Update the enemey's position
Enemy.prototype.update = function(delta) {
	if(! (this.player === undefined) && this.alive){ //only update if alive
		this.playerX = this.player.x;
		this.playerY = this.player.y;

		// Calculate direction towards player
		var toPlayerX = this.playerX - this.x;
		var toPlayerY = this.playerY - this.y;

		// Normalize
		var toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
		toPlayerX = toPlayerX / toPlayerLength;
		toPlayerY = toPlayerY / toPlayerLength;

		this.rotation = Math.atan2(toPlayerY, toPlayerX);

		this.dmgtick = (this.dmgtick+1) % 4; //keep between 0 and 3

		//check for collision with player shield & player itself
		if (toPlayerLength < 40 && this.dmgtick == 0) { //damage once every 4 ticks
			this.player.shield -= 5;
			this.player.dmgcount = 60; // 60 ticks until shield regenerates
		}

		if (toPlayerLength < 10) { //checking for collision with player- if so, die
			this.player.health -= 5;
			this.alive = false;
		}

		var approach = true; // tracks if enemy is currently approaching player
		//Move towards the player
		if (toPlayerLength > this.orbit+5 || this.player.shield <= 0){ //if shield is down enemy will continue to approach 
			this.angle = Math.atan2(toPlayerY,toPlayerX)+Math.PI;
			this.x += toPlayerX * this.speed;
			this.y += toPlayerY * this.speed;
			//approach = true;

		}//Move away from player
		else if (toPlayerLength < this.orbit-5){
			this.angle = Math.atan2(toPlayerY, toPlayerX)+Math.PI;
			this.x -= toPlayerX * this.speed * 2;
			this.y -= toPlayerY * this.speed * 2;
			//approach = true;

		}//orbit
		else{
			this.angle -= 0.02;//Math.acos(1-Math.pow(3/toPlayerLength,2)/2);

			this.x = ((toPlayerLength * Math.cos(this.angle)) + (this.player.x));

			this.y = ((toPlayerLength * Math.sin(this.angle)) + (this.player.y));
			
		}

	}
};

//As it sounds, draw the enemy object
Enemy.prototype.draw = function(ctx) {
	if (this.alive) { //only draw if alive
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x - (this.x + this.width/2), this.y - (this.y + this.height/2), this.width, this.height);
		ctx.restore();
	}
};

//Init the player/turret
Turret = function (x,y,name) {
	this.x = x; 
	this.y = y;
	this.speed = 200;
	this.health = 50; //balance parameter
	this.shield = 500;
	this.direction = 0; //radians
	this.damage = 100;
	this.name = name;
	this.dmgcount = 0; //count for timing since last damaged, will be used for regenerating shield

};

Turret.prototype.update = function (delta, gc) { //call this to update properties and draw

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
	var dDir = this.findDirection(mouseX,mouseY); //delta in direction

	if (this.dmgcount > 0) {
		this.dmgcount--;
	}

	if (this.shield < 500 && this.shield > 0 && this.dmgcount == 0) {
		this.shield += 0.25; //shield will regenerate very slowly
	}

	if (this.health < 0) {
		this.health = 0;
	}

	this.direction += dDir;
};

Turret.prototype.draw = function (ctx) { 
	ctx.save(); //save the state to stack before rotating
	ctx.translate(this.x,this.y);
	ctx.rotate(this.direction);

	//draw shield
	var shieldColor = "#"; 
	for (var i = 0; i < 3; i++) {
		shieldColor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
	}

	ctx.beginPath();
	ctx.arc(0, 0, 40, 0, 2 * Math.PI, false);
	ctx.lineWidth = 4;
	ctx.strokeStyle = shieldColor;//rgb(Math.floor(100 + 70*Math.random()),Math.floor(100 + 70*Math.random()),Math.floor(100 + 70*Math.random()));
	if (this.shield > 0) { //only draw if greater than 0
		ctx.stroke(); 
	}
	ctx.closePath();	

	ctx.beginPath();
	ctx.arc(0, 0, 10, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'green';
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#003300';
	ctx.stroke();


	ctx.fillStyle = "#FF0000";
	ctx.fillRect(-15,-1,10,2);
	ctx.closePath();
	ctx.restore(); //restore back to original
};

Turret.prototype.findDirection = function (mX,mY) {
	var distanceX = this.x - mX;
	var distanceY = this.y - mY;
	var newDir = Math.atan2(distanceY,distanceX); //find angle from arctangent
	var dDir = newDir - this.direction; //delta in direction
	return dDir;
};

Planet = function(x, y, name) {
	this.x = x;
	this.y = y;
	this.health = 10000;
	this.damageTaken = 0;
	this.name = name;
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

Healthbar = function(x, y, owner) {
	this.x = x;
	this.y = y;
	this.maxhealth = owner.health;
	this.health = owner.health;
	this.healthpercent = 1;
	this.name = owner.name;
	if (owner.shield) {
		this.maxshield = owner.shield;
		this.shield = owner.shield;
		this.shieldpercent = 1;
	}
}

Healthbar.prototype.update = function(delta, owner) {
	this.health = owner.health;
	this.healthpercent = this.health / this.maxhealth;
	if (this.shield && owner.shield) {
		this.shield = owner.shield;
		//console.log("this.shield & owner.shield: " + this.shield + " - " + owner.shield);
		this.shieldpercent = this.shield / this.maxshield;
	}
}

Healthbar.prototype.draw = function(ctx) {
	ctx.beginPath()
	ctx.fillStyle = "red";
	ctx.fillRect(this.x, this.y, 300 * this.healthpercent, 20);
	ctx.font = "12pt Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(this.name, this.x + 150, this.y + 15);

	if (this.shield) {
		if (this.shield <= 0) {
			ctx.fillStyle = "white";
			ctx.font = "12pt Arial";
			ctx.textAlign = "center";
			ctx.fillText("Shields down!", this.x + 150, this.y + 45);
		}
		else {
			ctx.fillStyle = "blue";
			ctx.fillRect(this.x, this.y + 30, 300 * this.shieldpercent, 20);
			ctx.font = "12pt Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.fillText("Shields", this.x + 150, this.y + 45);
		}
	}	


	ctx.closePath();
}

Bullet = function(x, y, r, playerX, playerY, speed, damage, color) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.cx = x + (this.width/2);
	this.cy = y + (this.height/2);
	this.playerX = playerX;
	this.playerY = playerY;
	this.speed = speed; //constant that determines the velocity the bullet travels at
	this.damage = damage; //The damage the bullet does

	this.color = color;

	this.alive = true; //Used for determining damage and whether to draw

	this.dmgtick = 0; //Damage tick counter, used in Bullet.update() for determining damage

	this.rotation = 0;
};

//Update the bullet's position
Bullet.prototype.update = function(delta){

	//Calculate direction to travel in order to reach point specified
	var toplayerX = this.playerX - this.x;
	var toplayerY = this.playerY - this.y;

	//Normalize
	var toplayerLength = Math.sqrt(toplayerX * toplayerX + toplayerY * toplayerY);
	toplayerX = toplayerX / toplayerLength;
	toplayerY = toplayerY / toplayerLength;

	this.rotation = Math.atan2(toplayerY, toplayerX);

	this.dmgtick = (this.dmgtick+1)%4; //apparently need to keep between 0 and 3

	//Move towards playered location
	if(this.alive === true) {
		this.x += toplayerX * this.speed;
		this.y += toplayerX * this.speed;
	}

};

//Draw the bullet object
Bullet.prototype.draw = function(ctx) {
	if (this.alive) { //only draw if alive
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctx.fill();
		ctx.restore();
	}
};
/////////////////---------\\\\\\\\\\\\\\\\\\\\\\\\\\

///////////////// INIT FUNCTIONS \\\\\\\\\\\\\\\\\\\
//Inits the main menu, shows title and play button
function initMainMenu() {
	//This block initiliazes the mainmenu canvas, sets the context, and sets its width and height to that of the user's screen
	var canvas = document.getElementById('mainmenu');
	currentcanvas = 'mm';
	var ctx = canvas.getContext('2d');
	winwidth = document.documentElement.clientWidth;
	winheight = document.documentElement.clientHeight;
	canvas.width = winwidth;
	canvas.height = winheight;

	//Render the Title
	ctx.font = "30pt Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("Earth Invader", winwidth / 2, 50);

	//Initialize Array of clickable elements, and then push in the parameters that would make a rectangle ***Note, this may be innefficient for just one element, consider revision
	var elements = [];
	elements.push({
		color: "red",
		width: 200,
		height: 75,
		top: winheight / 2 + 50,
		left: winwidth / 2 - 100
	});

	//render each object in elements as per parameters
	elements.forEach(function(element) {
		ctx.fillStyle = element.color;
		ctx.fillRect(element.left, element.top, element.width, element.height);
	});

	//render text on the start button
	ctx.fillStyle = "black";
	ctx.fillText("Start", winwidth / 2, winheight / 2 + 100);


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
	winwidth = document.documentElement.clientWidth;
	winheight = document.documentElement.clientHeight;
	canvas.width = winwidth;
	canvas.height = winheight;

	ctx.font = "30pt Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("Level Select", winwidth / 2, 50);
	ctx.fillStyle = "green";
	ctx.fillRect(canvas.width / 2 - 100, canvas.height - 150, 200, 75);
	ctx.fillStyle = "black";
	ctx.fillText("Play", winwidth / 2, winheight - 100);

//////////////////////////////////////////////////////////

	ctx.font = "20pt Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("Select a Planet Type", winwidth / 2, 150);

	ctx.fillStyle = "red";
	ctx.fillRect((canvas.width / 4) / 2 + 100, 200, 200, 75);
	ctx.fillStyle = "black";
	ctx.fillText("Fire", (canvas.width / 4) / 2 + 200, 250);

	ctx.fillStyle = "white";
	ctx.fillRect((canvas.width / 2) - 250, 200, 200, 75);
	ctx.fillStyle = "black";
	ctx.fillText("Air", (canvas.width / 2) - 150, 250);

	ctx.fillStyle = "blue";
	ctx.fillRect((canvas.width / 2) + 50, 200, 200, 75);
	ctx.fillStyle = "black";
	ctx.fillText("Water", (canvas.width / 2) + 150, 250);

	ctx.fillStyle = "brown";
	ctx.fillRect(((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100), 200, 200, 75);
	ctx.fillStyle = "black";
	ctx.fillText("Rock", ((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100) + 100, 250);

/////////////////////////////////////////////////////////////

	ctx.font = "20pt Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("Select a Weapon Type", winwidth / 2, 350);

	ctx.fillStyle = "red";
	ctx.fillRect((canvas.width / 4) / 2 + 100, 400, 200, 75);
	ctx.fillStyle = "black";
	ctx.fillText("Fire", (canvas.width / 4) / 2 + 200, 450);

	ctx.fillStyle = "white";
	ctx.fillRect((canvas.width / 2) - 250, 400, 200, 75);
	ctx.fillStyle = "black";
	ctx.fillText("Air", (canvas.width / 2) - 150, 450);

	ctx.fillStyle = "blue";
	ctx.fillRect((canvas.width / 2) + 50, 400, 200, 75);
	ctx.fillStyle = "black";
	ctx.fillText("Water", (canvas.width / 2) + 150, 450);

	ctx.fillStyle = "brown";
	ctx.fillRect(((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100), 400, 200, 75);
	ctx.fillStyle = "black";
	ctx.fillText("Rock", ((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100) + 100, 450);

	canvas.addEventListener('click', function(event) {
		var cLeft = canvas.offsetLeft;
		var cTop = canvas.offsetTop;
		var x = event.pageX - cLeft;
		var y = event.pageY - cTop;

		if (y > canvas.height - 150 && y < canvas.height - 150 + 75 && x > canvas.width / 2 - 100 && x < canvas.width / 2 - 100 + 200) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			initGame();
		}
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
	render = function(){
		stars.forEach(function(star){
			star.draw(starctx)
		});
	};
	render();
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

	var planet = new Planet(halfwidth, halfheight, "Planet");
	var enemies = [];
	var defenders = [];
	var spawns = [[40, 40], [40, halfheight], [40, clientHeight], [halfwidth, 40], [halfwidth, clientHeight], [clientWidth - 40, 40], [clientWidth - 40, halfheight], [clientWidth - 40, clientHeight - 40]];
	var enemycolors = ["red", "blue", "white", "brown"];

	//Create a player, an enemy, and assign the player to enemy so that it will follow it
	var player = new Turret(halfwidth, 45, "Player");
	var pBullets = [];

	var playerhealth = new Healthbar(10, 10, player);
	var planethealth = new Healthbar(clientWidth - 310, 10, planet);
	var enemycount = 1;
	var defendercount = 1;
	var makeEnemies = function(x,y, color) {
		var randOrbit = Math.round(Math.random()*50) + 30; //30 to 80
		var enemy = new Enemy(x, y, 10, 10, randOrbit, color);
		enemy.assignplayer(player);
		enemies.push(enemy);
		if (enemycount < 7) {
			setTimeout(function(){
				makeEnemies(x, y, color);
			}, 1000);
			enemycount += 1;
		}
	};
	var makeDefenders = function(x,y, color) {
		var randOrbit = Math.round(Math.random()*50) + 40; //40 to 90
		var enemy = new Enemy(x, y, 10, 10, randOrbit, color);
		enemy.assignplayer(planet);
		defenders.push(enemy);
		if (defendercount < 7) {
			setTimeout(function(){
				makeDefenders(x, y, color);
			}, 1000);
			defendercount += 1;
		}
	};
	makeEnemies(halfwidth, halfheight + 100, "red");
	makeDefenders(clientWidth / 2 - 40, clientHeight / 2 - 40, "red");

	gamecanvas.addEventListener('mousedown', function(event) {
		console.log("clicked");
		var cLeft = gamecanvas.offsetLeft;
		var cTop = gamecanvas.offsetTop;
		var mx = event.pageX - cLeft;
		var my = event.pageY - cTop;
		console.log("vars made");

		var bullet = new Bullet(player.x, player.y, 3, mx, my, 10, 10, "red");
		console.log("made bullet");
		pBullets.push(bullet);
		console.log("pushed to array")
	}, false);

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

	//updates the positions of the player and enemy
	var update = function(delta){
		enemies.forEach(function(enemy){
			enemy.update(delta, gamecanvas);
		});
		defenders.forEach(function(enemy){
			enemy.update(delta, gamecanvas);
		});	
		pBullets.forEach(function(bullet){
			bullet.update();
		});


		player.update(delta, gamecanvas);
		playerhealth.update(delta, player);
		planethealth.update(delta, planet);
		planet.update(delta);


		if (((Date.now() - wave) / 1000) > 15) {
			wave = Date.now();
			enemycount = 1;
			var randomint = Math.floor(Math.random() * 8);
			makeEnemies(spawns[randomint][0], spawns[randomint][1], enemycolors[Math.floor(Math.random() * 4)]);
		};
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
			enemy.draw(gamectx);
		});
		defenders.forEach(function(enemy){
			enemy.draw(gamectx);
		});
		playerhealth.draw(gamectx);
		planethealth.draw(gamectx);
		gamectx.font = "20pt Arial";
		gamectx.fillStyle = "white";
		gamectx.textAlign = "center";
		gamectx.fillText(Math.floor((Date.now() - start) / 1000), winwidth / 2, 30);
		player.draw(gamectx);
		pBullets.forEach(function(bullet){
			bullet.draw(gamectx);
		});
	};

	//updates the time, runs the main loop
	var then = Date.now();
	var start = Date.now();
	var wave = Date.now();
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