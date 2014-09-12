//////////////////////////////////////////////////////
///   Turret Class - The player
//////////////////////////////////////////////////////

Turret = function (x,y, eArrays, eBullets, powerups) { // Takes position, name, enemies, their bullets, and powerups
	this.x = x; 
	this.y = y;
	this.speed = 200;
	this.health = 500; // Balance parameter
	this.shield = 200;
	this.direction = 0; // In radians
	this.dmgcount = 0; // Count for timing since last damaged, will be used for regenerating shield
	this.powerups = powerups; // Powerup array
	this.name = "Player";

	this.radius = 40;
	this.eArrays = eArrays; // Array of enemies 
	this.eBullets = eBullets; // Array of enemy bullets
	this.alive = true;
	this.regen = false; // Used to regenerate shield after reaching 0

};

Turret.prototype.checkCollision = function (enemyArray, isbullet, ispowerup) { // Check collision, works for enemies, bullets, and powerups
	for (var i = 0; i < enemyArray.length; i++) {
		if (ispowerup && collision(this,enemyArray[i])) { // If the colliding object is a powerup, grant the corresponding power and set their timers
			if (enemyArray[i].type === "air") {
				if (!powerups.multishot.toggle) {
					powerups.multishot.toggle = true;
				} else {
					powerups.multishot.timer = 1000;
				}
			} else if (enemyArray[i].type === "fire") {
				if (!powerups.fastshot.toggle) {
					powerups.fastshot.toggle = true;
				} else {
					powerups.fastshot.timer = 1000;
				}
			} else if (enemyArray[i].type === "water") {
				if (!powerups.splash.toggle) {
					powerups.splash.toggle = true;
				} else {
					powerups.splash.timer = 1000;
				}
			} else if (enemyArray[i].type === "rock") {
				if (!powerups.penetrate.toggle) {
					powerups.penetrate.toggle = true;
				} else {
					powerups.penetrate.timer = 1000;
				}
			} else if (enemyArray[i].type === "health") {
				this.health = 500;
				this.shield = 200;
			} else if (enemyArray[i].type === "invincibility") {
				if (!powerups.invincibility.toggle) {
					powerups.invincibility.toggle = true;
				} else {
					powerups.invincibility.timer = 1000;
				}
			}
			enemyArray[i].alive = false; // Kill the powerup
		} else { // If not a powerup
			if (enemyArray[i].alive && collision(this,enemyArray[i])) {
				if (this.shield > 0 && !powerups.invincibility.toggle) { // If shilds and no invincibility, take shield damage
					if (isbullet) {
						this.shield -= enemyArray[i].damage; // Take the correct damage if the object is a bullet
						enemyArray[i].alive = false;
					} else {
						this.shield -= 20; // If the object is an enemy, take a constant damage
					}
					if (!this.regen) {
						this.dmgcount = 120; // If not in regen, set shield delay to 120
					}
				} else if (this.shield <= 0 && this.health > 0 && !powerups.invincibility.toggle) { // If no shilds and no invincibility, take health damage. Same as above, but no shield behavior 
					if (isbullet) {
						this.health -= 20;
						enemyArray[i].alive = false;
					} else {
						this.health -= enemyArray[i].damage;
					}
				}
			}
		}
	}
}

Turret.prototype.update = function (delta, gc) { // Update position and vars
	// Keyboard handlers, for movement
	if (65 in keysDown) { // Left
		if (this.x > 0) {
			this.x -= this.speed * delta;
		} else {
			this.x = gc.width;
		}
	}
	if (87 in keysDown) { // Up
		if (this.y > 0) {
			this.y -= this.speed * delta;
		} else {
			this.y = gc.height;
		}
	}
	if (68 in keysDown) { // Right
		if (this.x < gc.width) {
			this.x += this.speed * delta;
		} else {
			this.x = 0;
		}
	}
	if (83 in keysDown) { // Down
		if (this.y < gc.height) {
			this.y += this.speed * delta;
		} else {
			this.y = 0;
		}
	}
	var dDir = this.findDirection(mouseX,mouseY); // Delta in direction

	// Collision
	this.checkCollision(this.eArrays, false, false);
	this.checkCollision(this.eBullets, true, false);
	this.checkCollision(this.powerups, false, true);


	//damage-related stuff

	if (this.dmgcount > 0) {
		this.dmgcount--;
	}

	if (this.shield < 200 && this.shield >=0 && this.dmgcount == 0) {
		this.shield += 0.25; //shield will regenerate very slowly
		this.regen = false;
	}
	if (this.shield > 0) {
		this.radius = 40;
	}

	if (this.shield <= 0) {
		this.radius = 10; //collision detection radius set to 40 (shield), reduced when shield is 
	}
	if (this.shield < 0) {
		this.shield = 0;
		this.dmgcount = 540;
		this.regen = true;
	}

	if (this.health < 0) {
		this.health = 0;
		this.alive = false;
	}

	this.direction += dDir;
};

Turret.prototype.draw = function (ctx) { 
	if (this.alive) {
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

		ctx.drawImage(sprite_player,-12,-12);
		ctx.restore(); //restore back to original
	}
};

Turret.prototype.findDirection = function (mX,mY) {
	var distanceX = this.x - mX;
	var distanceY = this.y - mY;
	var newDir = Math.atan2(distanceY,distanceX); //find angle from arctangent
	var dDir = newDir - this.direction; //delta in direction
	return dDir;
};