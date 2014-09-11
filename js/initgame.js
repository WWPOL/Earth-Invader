function initGame() {
	var igc = document.createElement('canvas');
	igc.id = 'game';
	document.body.appendChild(igc);
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
	var gameOver = false;
	var winGame = false;

	if (Options.planType === "fire") {
		if (Options.wepType === "fire") {
			scoremult = 1;
		} else if (Options.wepType === "air") {
			scoremult = 0.5;
		} else if (Options.wepType === "water") {
			scoremult = 1.5;
		} else if (Options.wepType === "rock") {
			scoremult = 1;
		};
	} else if (Options.planType === "air") {
		if (Options.wepType === "fire") {
			scoremult = 1.5;
		} else if (Options.wepType === "air") {
			scoremult = 1;
		} else if (Options.wepType === "water") {
			scoremult = 1;
		} else if (Options.wepType === "rock") {
			scoremult = 0.5;
		};
	} else if (Options.planType === "water") {
		if (Options.wepType === "fire") {
			scoremult = 0.5;
		} else if (Options.wepType === "air") {
			scoremult = 1;
		} else if (Options.wepType === "water") {
			scoremult = 1;
		} else if (Options.wepType === "rock") {
			scoremult = 1.5;
		};
	} else if (Options.planType === "rock") {
		if (Options.wepType === "fire") {
			scoremult = 1;
		} else if (Options.wepType === "air") {
			scoremult = 1.5;
		} else if (Options.wepType === "water") {
			scoremult = 0.5;
		} else if (Options.wepType === "rock") {
			scoremult = 1;
		};
	};

	//Variable to track if mouse is held down
	var mousedown = false;
	var firing = false;
	var shootcount = 0; //and how frequently to shoot
	var pBullets = [];
	var eBullets = [];
	var enemies = [];
	var defenders = [];
	var bossbars = [];
	var poweruparray = [];
	var poweruptimer = Math.floor(Math.random() * 30) + 30;
	if (Options.wepType === "fire") {
		var poweruptypes = ["tri", "splash", "penetrate", "health", "invincibility"];
	} else if (Options.wepType === "air") {
		var poweruptypes = ["fast", "splash", "penetrate", "health", "invincibility"];
	} else if (Options.wepType === "water") {
		var poweruptypes = ["tri", "fast", "penetrate", "health", "invincibility"];
	} else if (Options.wepType === "rock") {
		var poweruptypes = ["tri", "fast", "splash", "health", "invincibility"];
	}

	var planet = new Planet(halfwidth, halfheight, "Planet", planTraits[Options.planType].plancolor, planTraits[Options.planType].planstroke, pBullets);
	var planethealth = new Healthbar(clientWidth - 310, 10, planet, false);

	//Create a player, an enemy, and assign the player to enemy so that it will follow it
	var player = new Turret(halfwidth, 45, "Player", [enemies,defenders], eBullets, poweruparray);
	var playerhealth = new Healthbar(10, 10, player, false);

	var spawns = [[40, 40], [40, halfheight], [40, clientHeight], [halfwidth, 40], [halfwidth, clientHeight], [clientWidth - 40, 40], [clientWidth - 40, halfheight], [clientWidth - 40, clientHeight - 40]];
	var enemytypes = ["fire", "air", "water", "rock"];
	var enemycount = 1;
	var defendercount = 14;

	var makeEnemies = function(x,y, type) {
		var randOrbit = Math.round(Math.random()*20) + 60; //30 to 80
		var enemy = new Enemy(x, y, 10, 10, randOrbit, type, pBullets, eBullets, false);
		enemy.assignplayer(player);
		enemies.push(enemy);
		if (enemycount < 7) {
			setTimeout(function(){
				makeEnemies(x, y, type);
			}, 1000);
			enemycount += 1;
		}
	};
	var makeBoss = function(x,y, type) {
		var randOrbit = Math.round(Math.random()*20) + 60; //30 to 80
		var boss = new Enemy(x, y, 30, 30, randOrbit, type, pBullets, eBullets, true);
		boss.assignplayer(player);
		var bosshealth = new Healthbar(x, y, boss, true);
		bossbars.push(bosshealth);
		enemies.push(boss);
	};
	var makeDefenders = function(x,y, type) {
		var randOrbit = Math.round(Math.random()*20) + 80; //40 to 90
		var enemy = new Enemy(x, y, 10, 10, randOrbit, type, pBullets, eBullets, false);
		enemy.assignplayer(planet);
		defenders.push(enemy);
		if (defendercount > 0) {
			setTimeout(function(){
				makeDefenders(x, y, type);
			}, 1000);
			defendercount -= 1;
		}
	};

////////////////////////////////////////
/// Handlers

	gamecanvas.addEventListener('mousedown', function (e) {
		mousedown = true; //set to 0, thus starting count
		//shootcount = 0;
	}, false);
	gamecanvas.addEventListener('mouseup', function (e) {
		mousedown = false;
	}, false);
	gamecanvas.addEventListener("mousemove", function (e) {
		var rect = gamecanvas.getBoundingClientRect(); //get bounding rectangle
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top; //clientX & Y are for whole window, left and top are offsets
	}, false);
	window.addEventListener('keydown', function (e) {
		keysDown[e.keyCode] = true;
	}, false);
	window.addEventListener('keyup', function(e) {
		delete keysDown[e.keyCode];
		if (e.keyCode === 80 && paused) {
			paused = false;
		} else if (e.keyCode === 80 && !paused) {
			paused = true;
		}
		if (e.keyCode === 77 && muted) {
			muted = false;
		} else if (e.keyCode === 77 && !muted) {
			muted = true;
		}
	}, false);

/////////////////////////////////////////

	timer = 3;
	setTimeout(function(){
		timer = 2;
		var clicksnd = new Audio();
		clicksnd.src = sounds.click;
		clicksnd.volume = Options.volume;
		clicksnd.play();
		clicksnd.addEventListener('ended', function() {
		    delete clicksnd;
		}, false);
		setTimeout(function(){
			timer = 1;
			var clicksnd = new Audio();
			clicksnd.src = sounds.click;
			clicksnd.volume = Options.volume;
			clicksnd.play();
			clicksnd.addEventListener('ended', function() {
			    delete clicksnd;
			}, false);
			setTimeout(function(){
				starting = false;
				var clicksnd = new Audio();
				clicksnd.src = sounds.click;
				clicksnd.volume = Options.volume;
				clicksnd.play();
				clicksnd.addEventListener('ended', function() {
				    delete clicksnd;
				}, false);
				makeEnemies(halfwidth, halfheight + 100, Options.planType);
				makeDefenders(clientWidth / 2 - 40, clientHeight / 2 - 40, Options.planType);
			}, 1000);
		}, 1000);
	}, 1000);

	powerups.fastshot.nrof = wepTraits[Options.wepType].rof;

	//main game loop, updates and renders the game
	var main = function(){
		var now = Date.now();
		var delta = now - then;

		if (!gameOver) {
			update(delta / 1000);
			render();			
		} else if (gameOver && winGame) {
			gameoverscreen(true);
		} else if (gameOver && !winGame) {
			gameoverscreen(false);
		}

		then = now;

		requestAnimationFrame(main);
	};

	//updates the positions of the player and enemy
	var update = function(delta){
		if (!starting) {
			if (!paused) {
				if (powerups.fastshot.toggle) {
					wepTraits[Options.wepType].rof = powerups.fastshot.frof;
				} else {
					wepTraits[Options.wepType].rof = powerups.fastshot.nrof;
				}
				//first, decide if new bullet should be added
				if (mousedown) {
					shootcount++;
		 			
		 			if (shootcount % wepTraits[Options.wepType].rof == 1) { //use rate of fire property as modulo, fire every <rof> frames
		 				var dx = mouseX - player.x; //use the global variables!
						var dy = mouseY - player.y ;
						var distanceToPlayer = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
						var angle = Math.atan2(dy, dx);

						if (Options.wepType === "air" || powerups.trishot.toggle) {
							for (var i = -2; i <= 2; i++) {
								//console.log(i + " Angle: " + angle*180/Math.PI);
								var bullet = new Bullet(player.x, player.y, 3, Math.cos(angle+(0.3*i)), Math.sin(angle+(0.3*i)), wepTraits[Options.wepType].speed, wepTraits[Options.wepType].damage, wepTraits[Options.wepType].color, Options.wepType, player, true);
								if (i != 2) {
									pBullets.push(bullet);
								}
							}
						} else {
							var bullet = new Bullet(player.x, player.y, 3, Math.cos(angle), Math.sin(angle), wepTraits[Options.wepType].speed, wepTraits[Options.wepType].damage, wepTraits[Options.wepType].color, Options.wepType, player, true);
						}
						var lasersnd = new Audio();
						lasersnd.src = sounds.player[Options.wepType];
						lasersnd.volume = Options.volume;
						lasersnd.play();
						lasersnd.addEventListener('ended', function() {
						    delete lasersnd;
						}, false);
						pBullets.push(bullet);

		 			} 
				}

				enemies.forEach(function(enemy){
					enemy.update(planet, gamectx, enemies);
				});
				defenders.forEach(function(enemy){
					enemy.update(planet, gamectx, defenders);
				});	
				pBullets.forEach(function(bullet){
					bullet.update(pBullets);
				});
				eBullets.forEach(function(bullet){
					bullet.update(eBullets);
				});
				bossbars.forEach(function(bar){
					bar.update();
				});
				poweruparray.forEach(function(powerup){
					powerup.update();
				});

				player.update(delta, gamecanvas);
				playerhealth.update();
				planethealth.update();
				planet.update();

				if (((Date.now() - wave) / 1000) > 15) {
					wave = Date.now();
					if (enemies.length < 100) {
						enemycount = 1;
						var randomint = Math.floor(Math.random() * 8);
						makeEnemies(spawns[randomint][0], spawns[randomint][1], enemytypes[Math.floor(Math.random() * 4)]);
					}
					if (defenders.length < 14) {
						defendercount = 14 - defenders.length; //15 as 14 + 1, to make sure that it spawns in case there are 0 defenders
						makeDefenders(clientWidth / 2 - 40, clientHeight / 2 - 40, Options.planType);
					}
				};
				if (((Date.now() - boss) / 1000) > 60) {
					boss = Date.now();
					var randomint = Math.floor(Math.random() * 8);
					makeBoss(spawns[randomint][0], spawns[randomint][1], enemytypes[Math.floor(Math.random() * 4)]);
				};
				if ((Date.now() - lastpowerup) / 1000 > poweruptimer) {
					var int = Math.floor(Math.random() * 5);
					var powerup = new Powerup(Math.floor(Math.random() * (winwidth) - 20)+10,Math.floor(Math.random() * (winheight) - 20)+10,poweruptypes[int],poweruparray,player);
					poweruparray.push(powerup);
					lastpowerup = Date.now();
					poweruptimer = Math.floor(Math.random() * 30) + 30;
				}

				if (planet.health <= 0) {
					gameOver = true;
					winGame = true;
				}
				if (player.health <= 0) {
					player.alive = false;
					gameOver = true;
				};
				if (!gameOver) {
					time = Math.floor((Date.now() - start) / 1000);
					score = Math.round((((enemiesKilled * planet.totaldamage) / time) * 10) * scoremult);
				}
				if ((powerups.trishot.timer > 0) && (powerups.trishot.toggle)) {
					powerups.trishot.timer -= 1;
				} else if ((powerups.trishot.timer <= 0) && (powerups.trishot.toggle)) {
					powerups.trishot.toggle = false;
					powerups.trishot.timer = 1000;
				}
				if ((powerups.fastshot.timer > 0) && (powerups.fastshot.toggle)) {
					powerups.fastshot.timer -= 1;
				} else if ((powerups.fastshot.timer <= 0) && (powerups.fastshot.toggle)) {
					powerups.fastshot.toggle = false;
					powerups.fastshot.timer = 1000;
				}
				if ((powerups.splash.timer > 0) && (powerups.splash.toggle)) {
					powerups.splash.timer -= 1;
				} else if ((powerups.splash.timer <= 0) && (powerups.splash.toggle)) {
					powerups.splash.toggle = false;
					powerups.splash.timer = 1000;
				}
				if ((powerups.penetrate.timer > 0) && (powerups.penetrate.toggle)) {
					powerups.penetrate.timer -= 1;
				} else if ((powerups.penetrate.timer <= 0) && (powerups.penetrate.toggle)) {
					powerups.penetrate.toggle = false;
					powerups.penetrate.timer = 1000;
				}
				if ((powerups.invincibility.timer > 0) && (powerups.invincibility.toggle)) {
					powerups.invincibility.timer -= 1;
				} else if ((powerups.invincibility.timer <= 0) && (powerups.invincibility.toggle)) {
					powerups.invincibility.toggle = false;
					powerups.invincibility.timer = 1000;
				}
			}
		}
		if (muted) {
			Options.volume = 0;
		} else if (!muted) {
			Options.volume = normvol;
		}
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
			enemy.draw(gamectx, enemies);
		});
		defenders.forEach(function(enemy){
			enemy.draw(gamectx, defenders);
		});
		bossbars.forEach(function(bar){
			bar.draw(gamectx);
		});
		poweruparray.forEach(function(powerup){
			powerup.draw(gamectx);
		});
		playerhealth.draw(gamectx);
		planethealth.draw(gamectx);
		gamectx.font = "20pt Arial";
		gamectx.fillStyle = "white";
		gamectx.textAlign = "center";
		gamectx.fillText(time, winwidth / 2, 30);
		player.draw(gamectx);
		pBullets.forEach(function(bullet){
			bullet.draw(gamectx);
		});
		eBullets.forEach(function(bullet){
			bullet.draw(gamectx);
		});

		var cursorcolor = "#"; 
		for (var i = 0; i < 3; i++) {
			cursorcolor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
		}
		gamectx.fillStyle = cursorcolor;
		gamectx.fillRect(mouseX + 1,mouseY + 4,2,8);
		gamectx.fillRect(mouseX + 4,mouseY + 1,8,2);
		gamectx.fillRect(mouseX + 1,mouseY - 10,2,8);
		gamectx.fillRect(mouseX - 10,mouseY + 1,8,2);
		if (paused) {
			gamectx.font = "100pt Impact";
			gamectx.fillStyle = "green";
			gamectx.textAlign = "center";
			gamectx.fillText("Paused", winwidth / 2, winheight / 2);
		}
		if (starting) {
			gamectx.font = "100pt Impact";
			gamectx.fillStyle = "white";
			gamectx.textAlign = "center";
			gamectx.fillText(timer, winwidth / 2, winheight / 2);
		}
		if (muted) {
			gamectx.font = "20pt Impact";
			gamectx.fillStyle = "red";
			gamectx.textAlign = "right";
			gamectx.fillText("Muted", winwidth - 5, winheight - 5);
		}
		if (powerups.trishot.toggle) {
			gamectx.font = "20pt Impact";
			gamectx.fillStyle = "white";
			gamectx.textAlign = "left";
			gamectx.fillText("MULTISHOT",5,winheight - 5);
			gamectx.fillRect(150, winheight - 25, 200 * (powerups.trishot.timer / 1000), 20);
		}
		if (powerups.fastshot.toggle) {
			gamectx.font = "20pt Impact";
			gamectx.fillStyle = "red";
			gamectx.textAlign = "left";
			gamectx.fillText("FASTSHOT",5,winheight - 30);
			gamectx.fillRect(150, winheight - 50, 200 * (powerups.fastshot.timer / 1000), 20);
		}
		if (powerups.splash.toggle) {
			gamectx.font = "20pt Impact";
			gamectx.fillStyle = "blue";
			gamectx.textAlign = "left";
			gamectx.fillText("SPLASH",5,winheight - 55);
			gamectx.fillRect(150, winheight - 75, 200 * (powerups.splash.timer / 1000), 20);
		}
		if (powerups.penetrate.toggle) {
			gamectx.font = "20pt Impact";
			gamectx.fillStyle = "brown";
			gamectx.textAlign = "left";
			gamectx.fillText("PENETRATE",5,winheight - 80);
			gamectx.fillRect(150, winheight - 100, 200 * (powerups.penetrate.timer / 1000), 20);
		}
		if (powerups.invincibility.toggle) {
			gamectx.font = "20pt Impact";
			gamectx.fillStyle = "gold";
			gamectx.textAlign = "left";
			gamectx.fillText("INVINCIBLE",5,winheight - 105);
			gamectx.fillRect(150, winheight - 125, 200 * (powerups.invincibility.timer / 1000), 20);
		}
	};

	var gameoverscreen = function(didwin){
		clearScreen();
		if (score > highscore) {
			highscore = score;
			localStorage.setItem("highscore", JSON.stringify(highscore));
		}

		gamectx.font = "100pt Impact";
		if (didwin) {
			gamectx.fillStyle = "green";
			gamectx.textAlign = "center";
			gamectx.fillText("You Win!", winwidth / 2, winheight / 2);
		} else if (!didwin) {
			gamectx.fillStyle = "red";
			gamectx.textAlign = "center";
			gamectx.fillText("Game Over!", winwidth / 2, winheight / 2);
		}

		gamectx.font = "75pt Impact";
		gamectx.fillText("Score: " + score, winwidth / 2, (winheight / 2) + 110);

		gamectx.font = "30pt Impact";
		gamectx.fillText("Highscore: " + highscore, winwidth / 2, (winheight / 2) + 150);
		gamectx.fillText("Time: " + time + " seconds", winwidth / 2, (winheight / 2) + 185);
		gamectx.fillText("Enemies Killed: " + enemiesKilled, winwidth / 2, (winheight / 2) + 220);

		gamectx.font = "30pt Arial";
		gamectx.fillStyle = "green";
		gamectx.fillRect(gamecanvas.width / 2 - 100, gamecanvas.height - 150, 200, 75);
		gamectx.fillStyle = "black";
		gamectx.fillText("Replay", winwidth / 2, winheight - 100);

		var cursorcolor = "#"; 
		for (var i = 0; i < 3; i++) {
			cursorcolor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
		}
		gamectx.fillStyle = cursorcolor;
		gamectx.fillRect(mouseX + 1,mouseY + 4,2,8);
		gamectx.fillRect(mouseX + 4,mouseY + 1,8,2);
		gamectx.fillRect(mouseX + 1,mouseY - 10,2,8);
		gamectx.fillRect(mouseX - 10,mouseY + 1,8,2);

	};

	gamecanvas.addEventListener('click', function(event) {
		var cLeft = gamecanvas.offsetLeft;
		var cTop = gamecanvas.offsetTop;
		var x = event.pageX - cLeft;
		var y = event.pageY - cTop;

		if (y > gamecanvas.height - 150 && y < gamecanvas.height - 150 + 75 && x > gamecanvas.width / 2 - 100 && x < gamecanvas.width / 2 - 100 + 200 && gameOver) {
			gamectx.clearRect(0, 0, gamecanvas.width, gamecanvas.height);
			gameOver = false;
			winGame = false;
			for (x in enemies) {
				//delete enemies[x];
				var index = enemies.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in defenders) {
				//delete defenders[x];
				var index = defenders.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in pBullets) {
				//delete pBullets[x];
				var index = pBullets.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in eBullets) {
				//delete eBullets[x];
				var index = eBullets.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in bossbars) {
				//delete bossbars[x];
				var index = bossbars.indexOf(x);
				enemies.splice(index,1);
			}
			planet.alive = false;
			player.alive = false;
			delete player;
			delete planet;
			renderops.game = false;
			document.body.removeChild(igc);
			starting = true;
			time = 0;
			initLevelSelect();
		}
	}, false);

	//updates the time, runs the main loop
	var then = Date.now();
	var start = Date.now();
	var wave = Date.now();
	var boss = Date.now();
	var lastpowerup = Date.now();
	main();
}